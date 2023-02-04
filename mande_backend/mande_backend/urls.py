"""mande_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from mande_api import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('mande/user/create', 
    views.CreateUserAdminView.as_view(), name="create_user"),
    path('mande/gpslocation/create', 
    views.CreateGpsLocation.as_view(), name="create_gps"),
    path('mande/gpslocation/update', 
    views.update_location_usr, name="update_gps"),
    path('mande/gpslocation/view/', 
    views.view_location_usr, name="update_gps"),
    path('mande/address/create', 
    views.CreateAddress.as_view(), name="create_address"),
    path('mande/workers/view/<int:jobid>/', 
    views.get_workers, name="view_workers"),
    path('mande/images/upload', 
    views.upload_images, name="upload_img"),
    path('mande/job/create', 
    views.CreateJob.as_view(), name="create_job"),
    path('mande/user/update', 
    views.update_user, name="update_user"),
    path('mande/<str:type>/update',
    views.update_worker_cli, name="update_worker"),
    path('mande/compare/encoded',
    views.compare_sha256, name="compare_encoded"),
    path('mande/jobs/view',
    views.get_all_jobs, name="all_jobs_view"),
    path('mande/worker/register/job',
    views.register_job, name="reg_job"),
    path('mande/worker/view/ownjobs',
    views.get_my_jobs, name="my_jobs"),
    path('mande/paymentMethod/register',
    views.register_payment_method, name="reg_pay_method"),
    path('mande/paymentMethod/view',
    views.view_my_payment_method, name="view_pay_method"),
    path('mande/service/request',
    views.request_service, name="req_service"),
    path('mande/service/reject',
    views.reject_service, name="req_service"),
    path('mande/user/login',
    views.login_user, name="req_service"),
    path('mande/user/view',
    views.get_my_data, name="req_service"),
    path('mande/service/view',
    views.read_detailed_service, name="req_service"),
    path('mande/history/create',
    views.register_history, name="req_service"),
    path('mande/history/view',
    views.view_history, name="req_service"),
    path('mande/job/updateInfo',
    views.update_job, name="req_service"),
    path('mande/service/info/update',
    views.update_service, name="req_service"),
    path('mande/user/notify',
    views.send_email, name="req_service"),
    path('mande/paymentMethod/validate',
    views.validate_card, name="req_service"),
    path('mande/worker/service/client/info', views.get_client_in_service, name="req_service")
]


urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
