from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class MetaPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_query_param = "page"
    page_size_query_param = "page_size"
    max_page_size = 50

    def get_paginated_response(self, data, message="OK"):
        page_size = self.get_page_size(self.request) or self.page_size

        return Response({
            "message": message,
            "data": data,
            "meta": {
                "page": self.page.number,
                "page_size": page_size,
                "count": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
                "has_next": self.page.has_next(),
                "has_prev": self.page.has_previous(),
            }
        })
