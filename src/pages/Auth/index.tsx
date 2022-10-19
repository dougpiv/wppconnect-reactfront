import { useEffect, useState } from "react";
import api from "../../http/api";

function AuthPage() {
    const [qrcode, setQrcode] = useState<string | undefined>();
    const [status, setStatus] = useState<string | undefined>();
    const [session, setSession] = useState<string | undefined>();
    const [reload, setReload] = useState(0);
    const [loop, setLoop] = useState(false);
    const [message, setMessage] = useState({
        phone: "",
        message: "",
    });
    let token: string | null = localStorage.getItem("token");

    useEffect(() => {
        if (loop) {
            session !== undefined ? api.post(`${session}/send-message`, message) : "";
            const timer = setTimeout(() => setReload(reload + 1), 3e3);
            return () => clearTimeout(timer);
        }
    }, [reload, loop]);

    const onConnect = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let values = Object.fromEntries(new FormData(event.currentTarget).entries());
        console.log(values);
        setSession(values.session.toString());
        await api.post(`${values.session}/${import.meta.env.VITE_SECRET_KEY}/generate-token`).then((result) => {
            token = result.data.token;
            localStorage.setItem("token", JSON.stringify(result.data));
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
        });
        await api.post(`${values.session}/start-session`).then((result) => {
            setQrcode(result.data.qrcode);
            setStatus(result.data.status);
        });
    };

    const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let values = Object.fromEntries(new FormData(event.currentTarget).entries());
        console.log(values);
        setMessage({ phone: values.phone.toString(), message: values.message.toString() });
        setLoop(true);
    };

    const stopSending = () => {
        setLoop(false);
    };
    return (
        <div className="flex flex-col p-3">
            <form onSubmit={onConnect}>
                <label className="label">Session:</label>
                <input className="max-w-[128px] mr-4 input input-bordered" type={"text"} name="session" />
                <button className="btn" type="submit">
                    Conectar
                </button>
                <div className="mt-2">{status === "QRCODE" ? <img src={qrcode} /> : status === "CONNECTED" ? <p>Conectado</p> : ""}</div>
            </form>
            <form onSubmit={sendMessage}>
                <h1>Enviar MSG:</h1>
                <label className="label">Telefone:</label>
                <input className="max-w-[128px] mr-4 input input-bordered" type="text" name="phone" />
                <label className="label">Mensagem:</label>
                <input className="max-w-[128px] mr-4 input input-bordered" type="text" name="message" />
                <button className="btn" type="submit">
                    Enviar
                </button>
            </form>
            <div>
                <button className="btn" onClick={stopSending}>
                    Parar
                </button>
            </div>
        </div>
    );
}

export default AuthPage;
