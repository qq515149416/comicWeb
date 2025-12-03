import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Alert, Button, Card, Flex, Form, Input, Typography } from 'antd'
import '../display/display.css'

const presetAccount = {
    account: 'editor@comic.studio',
    password: 'demo1234'
}

export default function Login() {
    const navigate = useNavigate()
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)
    const timerRef = useRef()
    const [form] = Form.useForm()

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current)
            }
        }
    }, [])

    const handleSubmit = (values) => {
        setLoading(true)
        setStatus({ type: 'info', message: '正在模拟登录...' })
        timerRef.current = window.setTimeout(() => {
            setLoading(false)
            setStatus({ type: 'success', message: '登录成功，正在进入后台' })
            navigate('/admin', { state: { user: values.account } })
        }, 600)
    }

    const handleFinishFailed = () => {
        setStatus({ type: 'warning', message: '请输入账号和密码' })
    }

    const handleBackHome = () => {
        navigate('/')
    }

    return (
        <main className="page page-auth">
            <Flex justify="center" align="center" style={{ minHeight: '80vh' }}>
                <Card
                    bordered={false}
                    style={{
                        width: 'min(440px, 100%)',
                        borderRadius: 24,
                        boxShadow: '0 30px 80px rgba(15, 23, 42, 0.12)'
                    }}
                    bodyStyle={{ padding: '36px 40px 42px' }}
                >
                    <Flex vertical gap={8} style={{ marginBottom: 24 }}>
                        <Typography.Text type="secondary">ComicWeb · 管理入口</Typography.Text>
                        <Typography.Title level={2} style={{ margin: 0 }}>
                            账号登录
                        </Typography.Title>
                        <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                            示例账号：editor@comic.studio / demo1234（仅前端模拟流程）
                        </Typography.Paragraph>
                    </Flex>

                    {status && (
                        <Alert
                            showIcon
                            style={{ marginBottom: 24 }}
                            type={status.type}
                            message={status.message}
                        />
                    )}

                    <Form
                        layout="vertical"
                        form={form}
                        size="large"
                        requiredMark={false}
                        initialValues={presetAccount}
                        onFinish={handleSubmit}
                        onFinishFailed={handleFinishFailed}
                    >
                        <Form.Item
                            label="账号"
                            name="account"
                            rules={[{ required: true, message: '请输入账号' }]}
                        >
                            <Input placeholder="请输入账号" disabled={loading} />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password placeholder="请输入密码" disabled={loading} />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Flex vertical gap={12}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    block
                                    loading={loading}
                                >
                                    {loading ? '登录中...' : '登录'}
                                </Button>
                                <Button type="text" size="large" block onClick={handleBackHome}>
                                    返回展示页
                                </Button>
                            </Flex>
                        </Form.Item>
                    </Form>
                </Card>
            </Flex>
        </main>
    )
}

