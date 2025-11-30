import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getComicById } from './mockData'
import './display.css'

export default function Detail() {
    const navigate = useNavigate()
    const { comicId } = useParams()
    const comic = useMemo(() => getComicById(comicId), [comicId])

    if (!comic) {
        return (
            <main className="page page-detail">
                <section className="panel empty-state">
                    <h2>未找到漫画</h2>
                    <p>可能是链接失效或作品已下架，返回首页重新选择吧。</p>
                    <button type="button" className="action-button" onClick={() => navigate('/')}>
                        返回首页
                    </button>
                </section>
            </main>
        )
    }

    const openReader = (index) => navigate(`/reader/${comic.id}/${index}`)

    return (
        <main className="page page-detail">
            <button type="button" className="text-button" onClick={() => navigate(`/`)}>
                ← 返回上一页
            </button>

            <section className="panel detail-hero">
                <img src={comic.cover} alt={comic.title} className="detail-cover" />
                <div className="detail-meta">
                    <h1>{comic.title}</h1>
                    <p className="hint">{comic.description}</p>

                    <div>
                        <strong>分类</strong>
                        <div className="meta-row">
                            {comic.categories.map((item) => (
                                <span key={item}>{item}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <strong>作者</strong>
                        <div className="meta-row">
                            {comic.authors.map((item) => (
                                <span key={item}>{item}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <strong>标签</strong>
                        <div className="meta-row">
                            {comic.tags.map((item) => (
                                <span key={item}>{item}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <h2>内容缩略图</h2>
                    <span className="hint">共 {comic.pages.length} 张</span>
                </div>
                <div className="grid content-grid">
                    {comic.pages.map((thumbnail, index) => (
                        <button type="button" key={thumbnail} className="content-thumb" onClick={() => openReader(index)}>
                            <img src={thumbnail} alt={`page-${index + 1}`} loading="lazy" />
                        </button>
                    ))}
                </div>
            </section>
        </main>
    )
}

