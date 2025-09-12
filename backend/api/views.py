from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson.objectid import ObjectId

from .db import comments_collection
from .serializers import CommentSerializer


class CommentListCreate(APIView):
    def get(self, request):
        """Get all comments"""
        comments = list(comments_collection.find({}, {"_id": 0}))  # exclude Mongo _id
        return Response({"comments": comments})

    def post(self, request):
        """Create a new comment"""
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            comments_collection.insert_one(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDetail(APIView):
    def get(self, request, comment_id):
        """Fetch single comment by id"""
        comment = comments_collection.find_one({"id": comment_id}, {"_id": 0})
        if comment:
            return Response(comment)
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, comment_id):
        """Update a comment"""
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            result = comments_collection.update_one(
                {"id": comment_id},
                {"$set": serializer.data}
            )
            if result.matched_count:
                return Response(serializer.data)
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, comment_id):
        update_data = request.data
        result = comments_collection.update_one({"id": comment_id}, {"$set": update_data})
        if result.matched_count == 0:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        updated_comment = comments_collection.find_one({"id": comment_id}, {"_id": 0})
        return Response(updated_comment)

    def delete(self, request, comment_id):
        """Delete a comment"""
        result = comments_collection.delete_one({"id": comment_id})
        if result.deleted_count:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
