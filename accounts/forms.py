from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from accounts.models import Profile


class RegisterForm(UserCreationForm):
    paw_id = forms.CharField(
        max_length=255,
        label='Huella ID',
        widget=forms.TextInput(attrs={'placeholder': ' '})
    )

    username = forms.CharField(
        label='Nombre de usuario',
        widget=forms.TextInput(attrs={'placeholder': ' '})
    )

    name = forms.CharField(
        max_length=120,
        label='Nombre',
        widget=forms.TextInput(attrs={'placeholder': ' '})
    )

    password1 = forms.CharField(
        label='Contraseña',
        strip=False,
        widget=forms.PasswordInput(attrs={'placeholder': ' '})
    )

    password2 = forms.CharField(
        label='Confirmar contraseña',
        strip=False,
        widget=forms.PasswordInput(attrs={'placeholder': ' '}),
        error_messages={
            'required': 'Debes confirmar la contraseña.',
            'password_mismatch': 'Las contraseñas no coinciden.'
        }
    )

    class Meta:
        model = User
        fields = ('paw_id', 'username', 'name', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.first_name = self.cleaned_data['name']
        if commit:
            user.save()
            Profile.objects.create(
                user=user,
                paw_id=self.cleaned_data['paw_id'],
                name=self.cleaned_data['name']
                )
        return user
