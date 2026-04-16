import os
import random
import shutil




SRC_DIR = "dataset_extracted"
DST_DIR = "dataset_split"

SPLITS = {
    "train": 0.7,
    "val": 0.15,
    "test": 0.15
}

CLASSES = ["Healthy", "Parkinson"]




for split in SPLITS:
    for cls in CLASSES:
        os.makedirs(os.path.join(DST_DIR, split, cls), exist_ok=True)




def split_class(cls_name):
    src_class_dir = os.path.join(SRC_DIR, cls_name)
    images = os.listdir(src_class_dir)
    random.shuffle(images)

    n = len(images)
    train_end = int(SPLITS["train"] * n)
    val_end = train_end + int(SPLITS["val"] * n)

    split_map = {
        "train": images[:train_end],
        "val": images[train_end:val_end],
        "test": images[val_end:]
    }

    for split, imgs in split_map.items():
        for img in imgs:
            src = os.path.join(src_class_dir, img)
            dst = os.path.join(DST_DIR, split, cls_name, img)
            shutil.copy(src, dst)

    print(f"{cls_name}: {n} images split")




for cls in CLASSES:
    split_class(cls)

print("Dataset split completed successfully.")
