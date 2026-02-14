import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Request, Response, NextFunction } from 'express';
import { getUserByEmail, refressTokens } from '../db/queries';


// export async function checkValiditi(req: Request, res: Response, next: NextFunction) {

//     let token: string | undefined = undefined;


//     if (req.cookies && req.cookies.token) {
//         token = req.cookies.token;
//     } else if (req.headers && req.headers.authorization) {
//         const auth = req.headers.authorization as string;
//         if (auth.startsWith('Bearer ')) {
//             token = auth.slice(7);
//         }
//     }

//     console.log('Auth middleware - resolved token present:', !!token);

//     if (!token) {
//         console.warn('Auth failed: no token provided (cookies, authorization header)');
//         return res.status(401).json({ message: "Unauthorized" });
//     }
//     try {
//         const decoded = jwt.verify(token, env.JWT_SECRET) as { email: string; };

//         const user = await getUserByEmail(decoded.email);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // attach user to request (cast to any if you haven't extended Request type)
//         (req as any).user = user;

//         next();
//     } catch (error) {
//         res.clearCookie('token');
//         return res.status(401).json({ message: "Invalid Token Please Login Again" });
//     }


// }


export async function checkValiditi(req: Request, res: Response, next: NextFunction) {
    let accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    // Check for Authorization header if no cookie
    if (!accessToken && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            accessToken = authHeader.substring(7);
        }
    }

    (req as any).user = null;

    if (!accessToken && !refreshToken) {
        return next();
    }


    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, env.JWT_SECRET);
            (req as any).user = decoded;
            return next();
        } catch (err) {
            // invalid access token, fall through to refresh token check if available
            if (!refreshToken) return next();
        }
    }

    if (refreshToken) {

        const baseConfig = {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
        };

        try {

            const result = await refressTokens(refreshToken);

            if (!result) {
                // If refresh failed (invalid token/session), clear cookies and proceed unauthenticated
                res.clearCookie('accessToken', baseConfig);
                res.clearCookie('refreshToken', baseConfig);
                return next();
            }

            const { newAccessToken, newRefreshToken, user: userInfo } = result as any;

            (req as any).user = userInfo;

            res.cookie('accessToken', newAccessToken, {
                ...baseConfig,
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie('refreshToken', newRefreshToken, {
                ...baseConfig,
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            return next();

        } catch (error) {
            console.log('Error verifying refresh token:', error);
            // On unexpected error, also clear cookies to be safe
            res.clearCookie('accessToken', baseConfig);
            res.clearCookie('refreshToken', baseConfig);
            return next();
        }
    }


    return next();

}
