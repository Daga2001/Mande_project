from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.dispatch import receiver
from django.conf import settings
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Creates and saves a new user"""
        if not email:
            raise ValueError('El usuario debe contener email')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """Creates and saves a new superuser"""
        user = self.create_user(email, password)
        user.is_superuser = True
        user.is_staff= True
        user.save(using=self._db)
        return user


class Address(models.Model):
    house_id = models.IntegerField(primary_key=True)
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.IntegerField()

class Gps_location(models.Model):
    latitude=models.CharField(max_length=100)
    longitude=models.CharField(max_length=100)

#Modelo de usuario base
class User(AbstractBaseUser, PermissionsMixin):
    uid = models.CharField(max_length=500, null=True)
    f_name = models.CharField(max_length=100, null=True)
    l_name = models.CharField(max_length=100, null=True)
    email = models.EmailField(max_length=80, unique=True)
    birth_dt = models.DateField(null=True)
    address_id = models.ForeignKey(Address, on_delete=models.CASCADE, related_name="address_id_user")
    location_id = models.ForeignKey(Gps_location, on_delete=models.CASCADE, related_name="location_id_user")
    # user choices
    is_worker = models.BooleanField('worker status', default=False)
    is_client = models.BooleanField('client status', default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserManager()
    USERNAME_FIELD = 'email'

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

class Client(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True,related_name="client")
    phone=models.IntegerField()

class Worker(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True,related_name="worker")
    avg_rating=models.CharField(max_length=100)
    avaliable=models.BooleanField()

class Worker_img_data(models.Model):
    idc_img_data=models.ImageField(upload_to='imagenesCedula/')
    prof_img_data=models.ImageField(upload_to='imagenesPerfil/')
    worker_id=models.ForeignKey(Worker,on_delete=models.CASCADE,related_name="worker_id_imgdata")

class Job(models.Model):
    jib = models.AutoField(primary_key=True)
    occupation = models.CharField(max_length=200)

class Payment_Method(models.Model):
    num=models.IntegerField(primary_key=True)
    type=models.CharField(max_length=200)
    expiration_dt= models.DateField()
    cvv=models.IntegerField()
    funds=models.IntegerField()
    uid=models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_id_payment")

class Receipt(models.Model):
    rid=models.IntegerField(primary_key=True)
    receipt_data=models.CharField(max_length=200)
    client_id=models.ForeignKey(Client,on_delete=models.CASCADE,related_name="client_id_receipt")

class Worker_Job(models.Model):
    worker_id=models.ForeignKey(Worker,on_delete=models.CASCADE,related_name="worker_id_job")
    jid=models.ForeignKey(Job,on_delete=models.CASCADE,related_name="jid_worker")
    type=models.CharField(max_length=200)
    price=models.IntegerField()

class Service(models.Model):
    sid=models.IntegerField(primary_key=True)
    rating=models.CharField(max_length=100)
    descrpition=models.CharField(max_length=500)
    client_id=models.ForeignKey(Client,on_delete=models.CASCADE,related_name="client_id_service")
    worker_id=models.ForeignKey(Worker,on_delete=models.CASCADE,related_name="worker_id_service")
    jid=models.ForeignKey(Job,on_delete=models.CASCADE,related_name="jid_service")
    card_num=models.ForeignKey(Payment_Method,on_delete=models.CASCADE,related_name="card_num_service")

class History(models.Model):
    hid=models.IntegerField(primary_key=True)
    amount=models.IntegerField()
    client_id=models.ForeignKey(Client,on_delete=models.CASCADE,related_name="client_id_history")
    sid=models.ForeignKey(Service,on_delete=models.CASCADE,related_name="sid_history")

