from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .db import comments_collection

class CommentAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Clean the collection before each test
        comments_collection.delete_many({})

        # Sample comment
        self.comment_data = {
            "id": "test1",
            "author": "Tester",
            "text": "This is a test comment",
            "date": "2025-01-01T12:00:00Z",
            "likes": 0,
            "image": ""
        }

    def test_create_comment(self):
        response = self.client.post("/api/comments/", self.comment_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Verify that the comment exists in MongoDB
        db_comment = comments_collection.find_one({"id": "test1"})
        self.assertIsNotNone(db_comment)
        self.assertEqual(db_comment["author"], "Tester")

    def test_get_comments(self):
        # Insert a comment directly
        comments_collection.insert_one(self.comment_data)
        response = self.client.get("/api/comments/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Access the list under 'comments'
        comments_list = response.data["comments"]
        self.assertEqual(comments_list[0]["id"], "test1")
        self.assertEqual(comments_list[0]["author"], "Tester")

    def test_update_comment_likes(self):
        comments_collection.insert_one(self.comment_data)
        response = self.client.patch(
            "/api/comments/test1/",
            {"likes": 5},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_comment = comments_collection.find_one({"id": "test1"})
        self.assertEqual(updated_comment["likes"], 5)

    def test_delete_comment(self):
        comments_collection.insert_one(self.comment_data)
        response = self.client.delete("/api/comments/test1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertIsNone(comments_collection.find_one({"id": "test1"}))
