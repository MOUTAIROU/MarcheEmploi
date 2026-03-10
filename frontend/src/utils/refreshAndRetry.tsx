import axios from "axios";
import { AnyActionArg } from "react";


export async function refreshAndRetry(failedFn: any, refreshToken: String, newAccessToken: any, ...args: AnyActionArg) {


    alert(refreshToken)

    if (!refreshToken) {
        alert("connexion1")
        // window.location.href = "/connexion"; // pas de refresh → déconnexion
        // return;
    }

    try {
        // 🔹 On récupère un nouveau accessToken

        alert('// 🔹 On récupère un nouveau accessToken')
        const r = await axios.post(`${process.env.SERVER_HOST}/auth/refresh`, { refreshToken });

        newAccessToken(r.data.accessToken)


        // Lorsque refreshToken renvoie un nouveau Access Token
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(failedFn(r.data.accessToken, ...args));
            }, 5000); // 1 seconde pour laisser React mettre à jour les states
        });



    } catch (err) { 
        alert("connexion")
        // Refresh expiré → déconnexion
        //  window.location.href = "/connexion";
    }
}
