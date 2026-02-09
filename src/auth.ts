import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from 'zod';
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

const authenticatedRoutes =[

]

 export const authConfig = NextAuth({ 
    pages: {
        signIn: 'auth/login',
        newUser: 'auth/new-account',
    },
    callbacks: {
        jwt: ({token, user}) => {
            // console.log({token,user});

            if(user){
                token.data = user;
            }

            return token;
        },
        session: ({session, token, user}) => {
            console.log({session,token,user});
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            session.user = token.data as any;

            return session;
        },
        authorized({auth, request: {nextUrl}}) {
            console.log(auth);
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            if(isOnDashboard){
                return false;
            }else if(isLoggedIn){
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        }
    },
    providers: [ 
        Credentials({
            async authorize(credentials){
                const parsedCrendials = z
                .object({email:z.string().email(), password: z.string().min(6)})
                .safeParse(credentials);

                if(!parsedCrendials.success) return null;

                const {email, password} = parsedCrendials.data;

                
                //buscar el correo
                const user = await prisma.user.findUnique({
                    where: { email: email.toLowerCase() }
                });
                
                if(!user) return null;

                if(!bcrypt.compareSync(password, user.password)){
                   return null;
                }

                //comprara las contraseñas
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password:_, ...rest} = user;
                return rest;
            }
        })
    ],
});

export const { handlers, auth, signIn, signOut } = authConfig;