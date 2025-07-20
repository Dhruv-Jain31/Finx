import { prisma } from "@repo/db"; // Import the singleton instance
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import axios from "axios";

const emailSchema = z.string().email();
const otpSchema = z.string().length(6).regex(/^\d+$/, "OTP must be numeric");

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "user@example.com" },
                otp: { label: "OTP", type: "text", placeholder: "Enter 6-digit OTP" },
                requestOtp: { label: "Request OTP", type: "hidden" }
            },
            async authorize(credentials) {
                if (!credentials) return null;

                // Handle OTP request
                if (credentials.requestOtp === "true") {
                    try {
                        // Validate email
                        const email = emailSchema.parse(credentials.email);

                        // Call OTP service to generate and send OTP
                        const response = await axios.post("https://otp-service-beta.vercel.app/api/otp/generate", {
                            email,
                            type: "numeric",
                            organization: "Finx",
                            subject: "OTP Verification"
                        });

                        if (response.data.message !== "OTP is generated and sent to your email") {
                            return null;
                        }

                        // Return temporary response to indicate OTP was sent
                        return { id: "pending", email, status: "otp_sent" };
                    } catch (e) {
                        console.error("OTP generation error:", e);
                        return null;
                    }
                }

                // Handle OTP verification
                try {
                    // Validate inputs
                    const email = emailSchema.parse(credentials.email);
                    const otp = otpSchema.parse(credentials.otp);

                    // Check if user exists
                    const user = await prisma.user.findFirst({
                        where: { email }
                    });

                    if (!user) {
                        throw new Error("User does not exist. Please sign up.");
                    }

                    // Verify OTP with service
                    const response = await axios.post("https://otp-service-beta.vercel.app/api/otp/verify", {
                        email,
                        otp
                    });

                    if (response.data.message !== "OTP is verified") {
                        return null;
                    }

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email
                    };
                } catch (e: any) {
                    console.error("OTP verification error:", e);
                    if (e.message === "User does not exist. Please sign up.") {
                        throw e; // This will trigger redirect on frontend
                    }
                    return null;
                }
            }
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async session({ session, token }: { session: any, token: any }) {
            if (session.user) {
                session.user.id = token.sub;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
        newUser: '/auth/signup'
    }
};