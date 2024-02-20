import torch
import timm
from torchvision import transforms
from PIL import Image

def load_class_names():
    class_names = []
    with open("./imagenet_classes.txt", "r") as f:
        class_names = [line.strip() for line in f.readlines()]
    return class_names

def classify_image(file_storage):
    # FileStorageオブジェクトをPIL.Imageオブジェクトに変換
    image = Image.open(file_storage.stream)
    # モデルをロード（ImageNetで学習された重みを使用）
    model = timm.create_model("resnet50.a1_in1k", pretrained=True,num_classes=1000)
    model.eval()  # 推論モードに設定

    # 画像の前処理
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    img_preprocessed = preprocess(image)
    imagenet_classes = load_class_names()

    # バッチ次元を追加
    img_batch = img_preprocessed.unsqueeze(0)

    # 推論実行
    with torch.no_grad():
        output = model(img_batch)

    # 信頼度スコアを計算し、上位5つを取得
    probabilities = torch.nn.functional.softmax(output, dim=1)[0] * 100
    top5_prob, top5_catid = torch.topk(probabilities, 5)
    # 上位5クラスの結果をリストで返す
    top5_results = [
    {"class": imagenet_classes[catid], "confidence": prob}
    for catid, prob in zip(top5_catid.tolist(), top5_prob.tolist())
    ]
    print(top5_results)
    return top5_results
