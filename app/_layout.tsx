import { Stack } from "expo-router";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "@/cache";
import { UserDetailContext } from "./../context/UserDetailContext";
import { useState } from "react";

export default function RootLayout() {

  const [userDetail, setUserDetail] = useState();

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
  }
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login/index" />
          </Stack>
        </UserDetailContext.Provider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
