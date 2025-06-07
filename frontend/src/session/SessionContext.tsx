import React, {createContext, useContext, useEffect, useState} from 'react';
import {SessionState} from '@project-types/user/session/sessionState.ts';
import {validateLogin} from '../api';

const defaultSession: SessionState = {
    user: {
        active: false,
        email: '',
        id: -1,
        login: '',
    },
    valid: false,
    accesses: [],
    roles: [],
};

export interface SessionContextValue extends SessionState {
    revalidate: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue>({
    ...defaultSession,
    revalidate: async () => {
    },
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [session, setSession] = useState<SessionState>(defaultSession);
    const [loading, setLoading] = useState(true);

    const validateSession = async () => {
        try {
            const result = await validateLogin();
            console.log('validateLogin returned: ', result);
            if (!result.session.valid) throw new Error('Session invalid');
            const newSession: SessionState = {
                valid: true,
                user: result.session.user,
                accesses: result.session.accesses || [],
                roles: result.session.roles || [],
            };
            console.log("New Session: ", newSession);
            setSession(newSession);
        } catch (e) {
            console.log("Unable to validate session: ", e)
            setSession(defaultSession);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        validateSession();
    }, []);

    return (
        <SessionContext.Provider value={{...session, revalidate: validateSession}}>
            {!loading && children}
        </SessionContext.Provider>
    );
};
