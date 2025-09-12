# api/serializers.py
from rest_framework import serializers

class CommentSerializer(serializers.Serializer):
    id = serializers.CharField()
    author = serializers.CharField()
    text = serializers.CharField()
    date = serializers.DateTimeField()
    likes = serializers.IntegerField()
    image = serializers.URLField(allow_blank=True)
