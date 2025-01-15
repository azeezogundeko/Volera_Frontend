// const handleNext = async () => {
//     localStorage.setItem('formData', JSON.stringify(formData));
//     console.log('Updated formData:', formData);
   

//     if (currentStep < TOTAL_STEPS) {
//       setCurrentStep((prev) => prev + 1);
//     } else {
//       console.log(formData.preferences);
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/onboarding`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
//           },
//           body: JSON.stringify(formData),
//         });

//         if (response.ok) {
//           toast.success("Onboarding complete!");
//           localStorage.removeItem('onboardingData'); // Clear saved data on success
//           router.push('/');
//         } else {
//           const errorData = await response.json();
//           console.error('Error saving onboarding data:', errorData);
//           toast.error("Failed to save data. Please try again.");
//         }
//       } catch (error) {
//         console.error('Onboarding error:', error);
//         toast.error("Something went wrong. Please try again.");
//       }
//     }
//   };