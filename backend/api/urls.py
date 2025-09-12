from django.urls import path
from .views import CommentListCreate, CommentDetail

urlpatterns = [
    path("comments/", CommentListCreate.as_view(), name="comment-list-create"),
    path("comments/<str:comment_id>/", CommentDetail.as_view(), name="comment-detail"),
]
