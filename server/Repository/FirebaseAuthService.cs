using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;

public class FirebaseAuthService
{
    private readonly FirebaseAuth _auth;

    public FirebaseAuthService()
    {
        if (FirebaseApp.DefaultInstance == null)
        {
            FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile("Configurations/firebase-key.json")
            });
        }
        _auth = FirebaseAuth.DefaultInstance;
    }

    public async Task<FirebaseToken> VerifyIdTokenAsync(string idToken)
    {
        return await _auth.VerifyIdTokenAsync(idToken);
    }
}