def classify_image(image):
    """
    画像分類のダミー関数。常に「cat」を返す。

    :param image: 分類する画像ファイル。
    :return: 分類結果と信頼度スコアを含む辞書。
    """
    # 実際の画像分類ロジックはここに実装される
    # ここでは、デバッグ/開発用にダミーの結果を返す
    return {
        'class': 'cat',  # 分類結果のクラス名
        'confidence': 0.95  # 信頼度スコア
    }