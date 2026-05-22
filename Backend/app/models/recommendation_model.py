"""
Recommendation model using TensorFlow/Keras ResNet50 + sklearn NearestNeighbors.

The embeddings.pkl file was generated using TensorFlow Keras ResNet50 with
`preprocess_input`, so we MUST use the same framework and preprocessing to
produce compatible feature vectors at query time.
"""

try:
    import tensorflow as tf
    from tensorflow.keras.preprocessing import image as keras_image
    from tensorflow.keras.layers import GlobalMaxPooling2D
    from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False

try:
    from sklearn.neighbors import NearestNeighbors
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    NUMPY_AVAILABLE = False

from numpy.linalg import norm
from io import BytesIO
import pandas as pd
import os
import pickle
from app.config.settings import RECOMMEND_DATA_PATH, FINAL_FILE_PATH, EMBEDDINGS_PATH, FILENAMES_PATH

# ---------------------------------------------------------------------------
# Load product datasets
# ---------------------------------------------------------------------------
recommend_df = pd.read_csv(RECOMMEND_DATA_PATH)
catalog_df = pd.read_csv(FINAL_FILE_PATH)

# ---------------------------------------------------------------------------
# Load embeddings and filenames for vector similarity
# ---------------------------------------------------------------------------
if os.path.exists(EMBEDDINGS_PATH) and os.path.exists(FILENAMES_PATH):
    with open(EMBEDDINGS_PATH, 'rb') as f:
        _raw_embeddings = pickle.load(f)
    EMBEDDINGS = np.array(_raw_embeddings)
    with open(FILENAMES_PATH, 'rb') as f:
        FILENAMES = pickle.load(f)
else:
    EMBEDDINGS = None
    FILENAMES = None

# ---------------------------------------------------------------------------
# Build the same Keras ResNet50 model used to generate the embeddings
# ---------------------------------------------------------------------------
if TF_AVAILABLE:
    _base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    _base_model.trainable = False
    model = tf.keras.Sequential([
        _base_model,
        GlobalMaxPooling2D()
    ])
else:
    model = None

# ---------------------------------------------------------------------------
# Build NearestNeighbors index (same as the Streamlit app)
# ---------------------------------------------------------------------------
if SKLEARN_AVAILABLE and EMBEDDINGS is not None:
    _nn = NearestNeighbors(n_neighbors=6, algorithm='brute', metric='euclidean')
    _nn.fit(EMBEDDINGS)
else:
    _nn = None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _normalize_product_id(product_id):
    """Normalize product IDs to integer when possible."""
    try:
        return int(product_id)
    except (TypeError, ValueError):
        return None


# Build ID-indexed caches for fast and stable lookups.
catalog_by_id = {}
for _, row in catalog_df.iterrows():
    normalized_id = _normalize_product_id(row.get('id'))
    if normalized_id is not None:
        catalog_by_id[normalized_id] = row.to_dict()

link_by_id = {}
for _, row in recommend_df.iterrows():
    normalized_id = _normalize_product_id(row.get('id'))
    if normalized_id is not None:
        link_by_id[normalized_id] = row.get('link')

# Ensure links are also available from catalog when present.
for pid, row in catalog_by_id.items():
    if pid not in link_by_id and row.get('link'):
        link_by_id[pid] = row.get('link')


# ---------------------------------------------------------------------------
# Feature extraction (TF/Keras — matches embeddings.pkl generation)
# ---------------------------------------------------------------------------

def extract_features(image_file):
    """
    Extract features from an image using the Keras ResNet50 model.

    This intentionally mirrors the feature_extraction() function from the
    original Streamlit app so that the resulting vector lives in the same
    feature space as the stored embeddings.

    Args:
        image_file: File-like object containing the image data

    Returns:
        Normalized feature vector (numpy 1-D array) or None on failure.
    """
    if not TF_AVAILABLE or not PIL_AVAILABLE or not NUMPY_AVAILABLE:
        return None
    if model is None:
        return None

    try:
        # Save to a temporary file because keras image.load_img expects a path
        tmp_path = '_tmp_query_image.jpg'
        with open(tmp_path, 'wb') as f:
            f.write(image_file.read())

        img = keras_image.load_img(tmp_path, target_size=(224, 224))
        img_array = keras_image.img_to_array(img)
        expanded_img_array = np.expand_dims(img_array, axis=0)
        preprocessed_img = preprocess_input(expanded_img_array)
        result = model.predict(preprocessed_img).flatten()
        normalized_result = result / norm(result)

        # Clean up
        try:
            os.remove(tmp_path)
        except OSError:
            pass

        return normalized_result
    except Exception as e:
        print(f"[extract_features] Error: {e}")
        return None


# ---------------------------------------------------------------------------
# Dominant-color fallback helpers
# ---------------------------------------------------------------------------

def _extract_dominant_rgb(image_file):
    """
    Extract approximate dominant RGB for coarse visual similarity fallback.
    """
    if not PIL_AVAILABLE or not NUMPY_AVAILABLE:
        return None

    try:
        img = Image.open(BytesIO(image_file.read())).convert('RGB').resize((64, 64))
        arr = np.array(img).reshape(-1, 3)
        return arr.mean(axis=0)
    except Exception:
        return None


def _color_distance(rgb_a, rgb_b):
    if rgb_a is None or rgb_b is None:
        return float("inf")
    return float(np.linalg.norm(rgb_a - rgb_b))


def _build_color_rgb_map():
    return {
        'black': np.array([20, 20, 20]),
        'white': np.array([235, 235, 235]),
        'grey': np.array([128, 128, 128]),
        'gray': np.array([128, 128, 128]),
        'blue': np.array([70, 110, 190]),
        'navy': np.array([25, 45, 100]),
        'red': np.array([190, 60, 60]),
        'maroon': np.array([120, 35, 45]),
        'green': np.array([70, 140, 75]),
        'olive': np.array([95, 100, 35]),
        'yellow': np.array([220, 190, 70]),
        'orange': np.array([220, 130, 45]),
        'pink': np.array([215, 145, 175]),
        'purple': np.array([120, 85, 150]),
        'brown': np.array([120, 85, 60]),
        'beige': np.array([205, 185, 155]),
        'cream': np.array([230, 220, 190]),
        'gold': np.array([200, 170, 85]),
        'silver': np.array([185, 185, 195]),
    }


COLOR_RGB_MAP = _build_color_rgb_map()


# ---------------------------------------------------------------------------
# Main recommendation function
# ---------------------------------------------------------------------------

def recommend_product_ids(image_file, num_recommendations=5):
    """
    Return product IDs using NearestNeighbors (euclidean) when embeddings are
    available, otherwise fall back to dominant-color matching.
    """
    image_file.seek(0)

    # --- Vector-based recommendation (NearestNeighbors, same as Streamlit) ---
    if _nn is not None and FILENAMES is not None:
        image_file.seek(0)
        target_vec = extract_features(image_file)
        if target_vec is not None:
            distances, indices = _nn.kneighbors([target_vec])
            recommended_ids = []
            for i in indices[0][:num_recommendations]:
                basename = os.path.basename(FILENAMES[i])
                pid_str = os.path.splitext(basename)[0]
                normalized_pid = _normalize_product_id(pid_str)
                if normalized_pid is not None:
                    recommended_ids.append(normalized_pid)
                else:
                    recommended_ids.append(pid_str)
            return recommended_ids

    # --- Fallback: dominant-color matching ---
    image_file.seek(0)
    target_rgb = _extract_dominant_rgb(image_file)
    if target_rgb is None:
        return list(catalog_by_id.keys())[:num_recommendations]

    scored_rows = []
    for pid, row in catalog_by_id.items():
        base_colour = str(row.get('baseColour', '')).strip().lower()
        color_rgb = None
        for color_name, rgb in COLOR_RGB_MAP.items():
            if color_name in base_colour:
                color_rgb = rgb
                break
        score = _color_distance(target_rgb, color_rgb) if color_rgb is not None else 9999.0
        scored_rows.append((score, pid))
    scored_rows.sort(key=lambda item: item[0])
    return [pid for _, pid in scored_rows[:num_recommendations]]


# ---------------------------------------------------------------------------
# Lookup helpers
# ---------------------------------------------------------------------------

def get_product_by_id(product_id):
    """
    Return full product metadata by ID with normalized ID handling.
    """
    normalized_id = _normalize_product_id(product_id)
    if normalized_id is None:
        return None

    row = catalog_by_id.get(normalized_id)
    if row is None:
        return None

    result = dict(row)
    result['id'] = normalized_id
    result['link'] = link_by_id.get(normalized_id) or row.get('link')
    return result

def get_link_by_id(index):
    """
    Get the link for a product by its ID.

    Args:
        index: Product ID

    Returns:
        Product link or None if not found
    """
    normalized_id = _normalize_product_id(index)
    if normalized_id is None:
        return None
    return link_by_id.get(normalized_id)
