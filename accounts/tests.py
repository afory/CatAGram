from django.test import TestCase
from django.contrib.auth.models import User


class AuthenticationRoutingTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='test-user',
            password='password-123',
        )

    def test_unauthenticated_root_redirects_to_login(self):
        response = self.client.get('/')

        self.assertRedirects(
            response,
            '/login/?next=/',
            fetch_redirect_response=False,
        )

    def test_login_page_redirects_authenticated_user_to_home(self):
        self.client.force_login(self.user)

        response = self.client.get('/login/')

        self.assertRedirects(response, '/', fetch_redirect_response=False)
        home_response = self.client.get(response['Location'])
        self.assertEqual(home_response.status_code, 200)
        self.assertTrue(response.wsgi_request.user.is_authenticated)

    def test_login_route_is_available_without_session(self):
        response = self.client.get('/login/')

        self.assertEqual(response.status_code, 200)
