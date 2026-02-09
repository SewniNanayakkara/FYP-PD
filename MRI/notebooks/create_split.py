import os
import shutil
import random

SOURCE_DIR = "dataset"
OUTPUT_DIR = "dataset_split"

SPLITS = {
    "train": 0.7,
    "val": 0.15,
    "test": 0.15
}

CLASSES = ["Healthy", "Parkinson"]

random.seed(42)

for split in SPLITS:
    for cls in CLASSES:
        os.makedirs(os.path.join(OUTPUT_DIR, split, cls), exist_ok=True)

for cls in CLASSES:
    class_dir = os.path.join(SOURCE_DIR, cls)

    images = []
    for root, _, files in os.walk(class_dir):
        for f in files:
            if f.lower().endswith((".png", ".jpg", ".jpeg")):
                images.append(os.path.join(root, f))

    random.shuffle(images)

    n_total = len(images)
    n_train = int(n_total * SPLITS["train"])
    n_val = int(n_total * SPLITS["val"])

    splits = {
        "train": images[:n_train],
        "val": images[n_train:n_train + n_val],
        "test": images[n_train + n_val:]
    }

    for split, files in splits.items():
        for img_path in files:
            dst = os.path.join(
                OUTPUT_DIR,
                split,
                cls,
                os.path.basename(img_path)
            )
            shutil.copy(img_path, dst)

print("✅ Dataset split completed")
