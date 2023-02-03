# Generated by Django 4.1.3 on 2023-02-02 16:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0014_auto_20230123_2118'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('uid', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=200)),
                ('f_name', models.CharField(max_length=100)),
                ('l_name', models.CharField(max_length=100)),
                ('birth_dt', models.DateField()),
                ('email', models.EmailField(max_length=200, unique=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Address',
            fields=[
                ('house_id', models.IntegerField(primary_key=True, serialize=False)),
                ('street', models.CharField(max_length=100)),
                ('city', models.CharField(max_length=100)),
                ('country', models.CharField(max_length=100)),
                ('postal_code', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('jid', models.AutoField(primary_key=True, serialize=False)),
                ('occupation', models.CharField(max_length=200, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Payment_Method',
            fields=[
                ('num', models.CharField(max_length=200, primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=200)),
                ('expiration_dt', models.DateField()),
                ('cvv', models.CharField(max_length=200)),
                ('funds', models.DecimalField(decimal_places=2, default=0, max_digits=30)),
                ('uid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_id_payment', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='client', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('phone', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Gps_location',
            fields=[
                ('uid', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='user_id_gps', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('latitude', models.CharField(max_length=100)),
                ('longitude', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Worker',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='worker', serialize=False, to=settings.AUTH_USER_MODEL)),
                ('password', models.CharField(max_length=500)),
                ('avg_rating', models.DecimalField(decimal_places=2, default=0.0, max_digits=5)),
                ('avaliable', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('sid', models.AutoField(primary_key=True, serialize=False)),
                ('rating', models.DecimalField(decimal_places=2, max_digits=5, null=True)),
                ('descrpition', models.CharField(max_length=500, null=True)),
                ('card_num', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='card_num_service', to='mande_api.payment_method')),
                ('jid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='jid_service', to='mande_api.job')),
                ('client_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='client_id_service', to='mande_api.client')),
                ('worker_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='worker_id_service', to='mande_api.worker')),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='address_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='address_id_user', to='mande_api.address'),
        ),
        migrations.AddField(
            model_name='user',
            name='groups',
            field=models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions'),
        ),
        migrations.CreateModel(
            name='Worker_Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.IntegerField(null=True)),
                ('jid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='jid_worker', to='mande_api.job')),
                ('worker_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='worker_id_job', to='mande_api.worker')),
            ],
        ),
        migrations.CreateModel(
            name='Worker_img_data',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('idc_img_data', models.ImageField(upload_to='imagenesCedula/')),
                ('prof_img_data', models.ImageField(upload_to='imagenesPerfil/')),
                ('worker_id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='worker_id_imgdata', to='mande_api.worker')),
            ],
        ),
        migrations.CreateModel(
            name='Receipt',
            fields=[
                ('rid', models.AutoField(primary_key=True, serialize=False)),
                ('receipt_data', models.ImageField(max_length=200, unique=True, upload_to='')),
                ('client_id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='client_id_receipt', to='mande_api.client')),
            ],
        ),
        migrations.CreateModel(
            name='History',
            fields=[
                ('hid', models.AutoField(primary_key=True, serialize=False)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=30)),
                ('sid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sid_history', to='mande_api.service')),
                ('client_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='client_id_history', to='mande_api.client')),
            ],
        ),
        migrations.AddConstraint(
            model_name='worker_job',
            constraint=models.UniqueConstraint(fields=('worker_id', 'jid'), name='worker_job_pk'),
        ),
        migrations.AddConstraint(
            model_name='worker_img_data',
            constraint=models.UniqueConstraint(fields=('idc_img_data', 'prof_img_data'), name='idc_prof_pk'),
        ),
    ]
