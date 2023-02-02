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
    street = models.CharField(max_length=100, null=False)
    city = models.CharField(max_length=100, null=False)
    country = models.CharField(max_length=100, null=False)
    postal_code = models.CharField(max_length=100, null=False)

#Modelo de usuario base
class User(AbstractBaseUser, PermissionsMixin):
    uid = models.AutoField(primary_key=True)
    type = models.CharField(max_length=200, null=False)
    f_name = models.CharField(max_length=100, null=False)
    l_name = models.CharField(max_length=100, null=False)
    birth_dt = models.DateField(null=False)
    email = models.EmailField(max_length=200, unique=True, null=False)
    address_id = models.ForeignKey(Address, on_delete=models.CASCADE, related_name="address_id_user", null=False)
    objects = UserManager()
    USERNAME_FIELD = 'email'

class Gps_location(models.Model):
    uid=models.OneToOneField(User,on_delete=models.CASCADE,primary_key=True,related_name="user_id_gps")
    latitude=models.CharField(max_length=100)
    longitude=models.CharField(max_length=100)

class Job(models.Model):
    jid = models.AutoField(primary_key=True)
    occupation = models.CharField(max_length=200, null=False, unique=True)

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

class Client(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE,primary_key=True,related_name="client")
    phone=models.CharField(null=False, max_length=100, unique=True)

class Worker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name="worker")
    password=models.CharField(null=False, max_length=500)
    avg_rating=models.DecimalField(null=False, max_digits=5, decimal_places=2, default=0.0)
    available=models.BooleanField(null=False)
    
class Worker_img_data(models.Model):
    idc_img_data=models.ImageField(upload_to='imagenesCedula/')
    prof_img_data=models.ImageField(upload_to='imagenesPerfil/')
    worker_id=models.OneToOneField(Worker,on_delete=models.CASCADE,related_name="worker_id_imgdata")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['idc_img_data', 'prof_img_data'], name='idc_prof_pk'
            )
        ]

class Payment_Method(models.Model):
    num=models.CharField(primary_key=True, max_length=200)
    type=models.CharField(max_length=200, null=False)
    expiration_dt= models.DateField(null=False)
    cvv=models.CharField(null=False, max_length=200)
    funds=models.DecimalField(null=False, default=0, max_digits=30, decimal_places=2)
    uid=models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_id_payment")

class Receipt(models.Model):
    rid=models.AutoField(primary_key=True)
    receipt_data=models.ImageField(max_length=200,null=False,unique=True)
    client_id=models.OneToOneField(Client,on_delete=models.CASCADE,related_name="client_id_receipt")

class Worker_Job(models.Model):
    worker_id=models.ForeignKey(Worker,on_delete=models.CASCADE,related_name="worker_id_job",null=False)
    jid=models.ForeignKey(Job,on_delete=models.CASCADE,related_name="jid_worker",null=False)
    price=models.IntegerField(null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['worker_id', 'jid'], name='worker_job_pk'
            )
        ]

class Service(models.Model):
    sid=models.AutoField(primary_key=True)
    rating=models.DecimalField(null=True, max_digits=5, decimal_places=2)
    descrpition=models.CharField(max_length=500, null=True)
    client_id=models.ForeignKey(Client,on_delete=models.CASCADE,related_name="client_id_service")
    worker_id=models.ForeignKey(Worker,on_delete=models.CASCADE,related_name="worker_id_service")
    jid=models.ForeignKey(Job,on_delete=models.CASCADE,related_name="jid_service")
    card_num=models.ForeignKey(Payment_Method,on_delete=models.CASCADE,related_name="card_num_service")

class History(models.Model):
    hid=models.AutoField(primary_key=True)
    amount=models.DecimalField(null=False,  max_digits=30, decimal_places=2)
    client_id=models.ForeignKey(Client,on_delete=models.CASCADE,related_name="client_id_history")
    sid=models.ForeignKey(Service,on_delete=models.CASCADE,related_name="sid_history")

