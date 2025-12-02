import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import '../display/display.css'

const presetAccount = {
    account: 'editor@comic.studio',
    password: 'demo1234'
}

export default function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState(presetAccount)
    const [status, setStatus] = useState('')
    const [loading, setLoading] = useState(false)
    const timerRef = useRef()

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current)
            }
        }
    }, [])

    const updateForm = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!form.account.trim() || !form.password.trim()) {
            setStatus('请输入账号和密码')
            return
        }
        setLoading(true)
        setStatus('正在模拟登录...')
        timerRef.current = window.setTimeout(() => {
            setLoading(false)
            setStatus('登录成功，正在进入后台')
            navigate('/admin', { state: { user: form.account } })
        }, 600)
    }

    return (
        <main className="page page-auth">
            <section className="panel auth-card">
                <div>
                    <p className="hint">ComicWeb · 管理入口</p>
                    <h1 className="heading">账号登录</h1>
                </div>
                <p className="hint">示例账号：editor@comic.studio / demo1234（仅前端模拟流程）。</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="field">
                        <span>账号</span>
                        <input
                            value={form.account}
                            placeholder="请输入账号"
                            onChange={(event) => updateForm('account', event.target.value)}
                            disabled={loading}
                        />
                    </label>

                    <label className="field">
                        <span>密码</span>
                        <input
                            type="password"
                            value={form.password}
                            placeholder="请输入密码"
                            onChange={(event) => updateForm('password', event.target.value)}
                            disabled={loading}
                        />
                    </label>

                    {status && <p className="auth-status">{status}</p>}

                    <div className="auth-actions">
                        <button type="button" className="text-button" onClick={() => navigate('/')}>
                            返回展示页
                        </button>
                        <button type="submit" className="action-button" disabled={loading}>
                            {loading ? '登录中...' : '登录'}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    )
}

