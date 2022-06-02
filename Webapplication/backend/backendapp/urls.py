from django.conf.urls import url, include
from backendapp import views

from django.conf.urls.static import static
from django.conf import settings


# Urls to my APIs
urlpatterns=[
    url(r'^layer2/$',views.layer2Api),
    url(r'^vnfs/$',views.vnfsApi),
    url(r'^sfcs/$',views.sfcsApi)
]