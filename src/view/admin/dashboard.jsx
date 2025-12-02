import { Button, Form, Input, Modal, Select, Space, Table, Tag, Upload, message } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import '../display/display.css'
import { comics as mockComics } from '../display/mockData'

const statusOptions = ['草稿', '待审核', '已上架', '已下架']

const parseList = (value = '') =>
    value
        .split(/[,，、\n]/)
        .map((item) => item.trim())
        .filter(Boolean)

const formatList = (list = []) => list.join(', ')

const seededData = mockComics.map((comic, index) => ({
    ...comic,
    status: statusOptions[index % statusOptions.length]
}))

const statusColorMap = {
    草稿: 'default',
    待审核: 'warning',
    已上架: 'success',
    已下架: 'error'
}

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })

export default function AdminDashboard() {
    const navigate = useNavigate()
    const location = useLocation()
    const [form] = Form.useForm()
    const [data, setData] = useState(seededData)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [messageApi, contextHolder] = message.useMessage()
    const [coverFileList, setCoverFileList] = useState([])
    const [pageImages, setPageImages] = useState([])

    const userName = location.state?.user || '内容管理员'

    useEffect(() => {
        const coverValue = coverFileList[0]?.url || ''
        form.setFieldsValue({ cover: coverValue })
    }, [coverFileList, form])

    useEffect(() => {
        const serializedPages = pageImages.length ? JSON.stringify(pageImages.map((item) => item.url)) : ''
        form.setFieldsValue({ pages: serializedPages })
    }, [pageImages, form])

    const openCreate = () => {
        setEditing(null)
        form.resetFields()
        form.setFieldsValue({ status: '草稿' })
        setCoverFileList([])
        setPageImages([])
        setModalOpen(true)
    }

    const openEdit = (record) => {
        setEditing(record)
        form.setFieldsValue({
            title: record.title,
            authors: formatList(record.authors),
            categories: formatList(record.categories),
            tags: formatList(record.tags),
            status: record.status,
            description: record.description,
            cover: record.cover
        })
        setCoverFileList(
            record.cover
                ? [
                      {
                          uid: `cover-${record.id}`,
                          name: record.title,
                          status: 'done',
                          url: record.cover
                      }
                  ]
                : []
        )
        setPageImages(
            (record.pages ?? []).map((url, idx) => ({
                uid: `${record.id}-page-${idx}`,
                name: `${record.title}-page-${idx + 1}`,
                url
            }))
        )
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        form.resetFields()
        setCoverFileList([])
        setPageImages([])
    }

    const handleCoverChange = async ({ fileList }) => {
        if (!fileList.length) {
            setCoverFileList([])
            return
        }
        const latest = fileList[fileList.length - 1]
        let previewUrl = latest.url || latest.thumbUrl
        if (latest.originFileObj && !previewUrl) {
            previewUrl = await getBase64(latest.originFileObj)
        }
        setCoverFileList([
            {
                ...latest,
                status: 'done',
                url: previewUrl,
                thumbUrl: previewUrl
            }
        ])
    }

    const handlePagesUpload = (file) => {
        getBase64(file).then((url) => {
            setPageImages((prev) => [
                ...prev,
                {
                    uid: file.uid,
                    name: file.name,
                    url
                }
            ])
        })
        return false
    }

    const handleRemovePage = (uid) => {
        setPageImages((prev) => prev.filter((item) => item.uid !== uid))
    }

    const movePage = (index, direction) => {
        setPageImages((prev) => {
            const nextIndex = index + direction
            if (nextIndex < 0 || nextIndex >= prev.length) {
                return prev
            }
            const next = [...prev]
            const temp = next[index]
            next[index] = next[nextIndex]
            next[nextIndex] = temp
            return next
        })
    }

    const handleDelete = (record) => {
        Modal.confirm({
            title: `确认删除《${record.title}》吗？`,
            okText: '删除',
            cancelText: '取消',
            okButtonProps: { danger: true },
            onOk: () => {
                setData((prev) => prev.filter((item) => item.id !== record.id))
                messageApi.success('已删除该作品')
            }
        })
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            let parsedPages = []
            if (values.pages) {
                try {
                    parsedPages = JSON.parse(values.pages)
                } catch (error) {
                    parsedPages = []
                }
            }
            if (!parsedPages.length) {
                messageApi.error('请至少上传一张内容图片')
                return
            }
            const coverValue = (values.cover || '').trim()
            if (!coverValue) {
                messageApi.error('请上传封面图片')
                return
            }
            const id = editing?.id ?? `c-${Date.now()}`
            const normalized = {
                id,
                title: values.title.trim(),
                authors: parseList(values.authors),
                categories: parseList(values.categories),
                tags: parseList(values.tags),
                description: values.description?.trim() || '暂无简介',
                cover: coverValue,
                status: values.status,
                pages: parsedPages
            }

            if (editing) {
                setData((prev) => prev.map((item) => (item.id === editing.id ? { ...item, ...normalized } : item)))
                messageApi.success('已更新作品信息')
            } else {
                setData((prev) => [{ ...normalized }, ...prev])
                messageApi.success('已创建新作品')
            }
            closeModal()
        } catch (error) {
            // 表单校验失败时不需要额外处理
        }
    }

    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    <strong>{text}</strong>
                    <div className="table-subtext">{record.description}</div>
                </div>
            )
        },
        {
            title: '作者',
            dataIndex: 'authors',
            key: 'authors',
            render: (authors) => authors.join(' / ')
        },
        {
            title: '分类',
            dataIndex: 'categories',
            key: 'categories',
            render: (categories) => (
                <Space wrap>
                    {categories.map((cat) => (
                        <Tag key={cat}>{cat}</Tag>
                    ))}
                </Space>
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            filters: statusOptions.map((value) => ({ text: value, value })),
            onFilter: (value, record) => record.status === value,
            render: (status) => <Tag color={statusColorMap[status]}>{status}</Tag>
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => openEdit(record)}>
                        编辑
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record)}>
                        删除
                    </Button>
                </Space>
            )
        }
    ]

    return (
        <main className="page page-admin">
            {contextHolder}
            <section className="panel admin-header">
                <div>
                    <p className="hint">你好，{userName}</p>
                    <h1 className="heading">漫画展示数据管理</h1>
                    <p className="hint">使用 Ant Design 表格即可完成增删改查，刷新后数据会回到示例状态。</p>
                </div>
                <div className="admin-toolbar">
                    <Button onClick={() => navigate('/login')}>返回登录</Button>
                    <Button type="primary" onClick={openCreate}>
                        新建漫画
                    </Button>
                </div>
            </section>

            <section className="panel admin-table-card">
                <div className="table-toolbar">
                    <span>共 {data.length} 部作品</span>
                </div>
                <Table rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
            </section>

            <Modal
                open={modalOpen}
                title={editing ? '编辑漫画' : '新增漫画'}
                onCancel={closeModal}
                onOk={handleSubmit}
                okText="保存"
            >
                <Form layout="vertical" form={form}>
                    <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
                        <Input placeholder="例如：月光便利店" />
                    </Form.Item>
                    <Form.Item name="authors" label="作者（用逗号分隔）" rules={[{ required: true, message: '请输入作者' }]}>
                        <Input placeholder="秋笙, 江临" />
                    </Form.Item>
                    <Form.Item name="categories" label="分类" rules={[{ required: true, message: '请输入分类' }]}>
                        <Input placeholder="科幻, 冒险" />
                    </Form.Item>
                    <Form.Item name="tags" label="标签">
                        <Input placeholder="连载, 全彩" />
                    </Form.Item>
                    <Form.Item name="status" label="上架状态" rules={[{ required: true, message: '请选择状态' }]}>
                        <Select options={statusOptions.map((value) => ({ value, label: value }))} />
                    </Form.Item>
                    <Form.Item name="description" label="一句话简介">
                        <Input.TextArea rows={3} placeholder="简要说明剧情或亮点" />
                    </Form.Item>
                    <Form.Item label="封面图片" required>
                        <Upload
                            accept="image/*"
                            listType="picture-card"
                            fileList={coverFileList}
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={handleCoverChange}
                        >
                            {coverFileList.length >= 1 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>上传封面</div>
                                </div>
                            )}
                        </Upload>
                        <p className="media-upload-hint">推荐尺寸 480×640，支持 JPG/PNG。</p>
                    </Form.Item>
                    <Form.Item name="cover" hidden rules={[{ required: true, message: '请上传封面图片' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="内容图片列表" required>
                        <div className="media-upload-section">
                            <Upload accept="image/*" multiple showUploadList={false} beforeUpload={handlePagesUpload}>
                                <Button icon={<PlusOutlined />}>添加内容图片</Button>
                            </Upload>
                            <p className="media-upload-hint">支持一次选择多张图片，使用下方按钮调整顺序。</p>
                            {pageImages.length ? (
                                <div className="media-upload-list">
                                    {pageImages.map((image, index) => (
                                        <div className="media-upload-card" key={image.uid}>
                                            <div className="media-upload-title">第 {index + 1} 页</div>
                                            <img src={image.url} alt={image.name} />
                                            <div className="media-upload-actions">
                                                <Button
                                                    size="small"
                                                    shape="circle"
                                                    icon={<ArrowUpOutlined />}
                                                    disabled={index === 0}
                                                    onClick={() => movePage(index, -1)}
                                                    title="上移"
                                                />
                                                <Button
                                                    size="small"
                                                    shape="circle"
                                                    icon={<ArrowDownOutlined />}
                                                    disabled={index === pageImages.length - 1}
                                                    onClick={() => movePage(index, 1)}
                                                    title="下移"
                                                />
                                                <Button
                                                    size="small"
                                                    shape="circle"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleRemovePage(image.uid)}
                                                    title="删除"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="media-upload-empty">暂未添加内容图片</div>
                            )}
                        </div>
                    </Form.Item>
                    <Form.Item name="pages" hidden rules={[{ required: true, message: '请上传内容图片' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </main>
    )
}

