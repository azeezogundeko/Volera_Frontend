export const verifyUser = async (token: string) => {
  // Simulate an API call to verify the user
  console.log('Verifying user with token:', token);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Verification failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('User verified successfully:', data);
    return data.isVerified;
  } catch (error) {
    console.error('Error verifying user:', error);
    return false;
  }
};
