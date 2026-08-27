import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import { UserProvider } from "./UserProvider";
import { BookingProvider } from "./BookingProvider";
import { FeedbackProvider } from "./FeedbackProvider";
import { ServiceProvider } from "./ServiceProvider";


export const AppProviders = ({ children }) => {
    return (
        <>
            <ThemeProvider>
                <AuthProvider>
                    <UserProvider>
                        <BookingProvider>
                            <FeedbackProvider>
                                <ServiceProvider>
                                {children}
                                </ServiceProvider>
                            </FeedbackProvider>
                        </BookingProvider>
                    </UserProvider>
                </AuthProvider>
            </ThemeProvider>
        </>
    );
}