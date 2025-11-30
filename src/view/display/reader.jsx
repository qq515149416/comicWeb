import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getComicById } from './mockData'
import './display.css'

export default function Reader() {
    const navigate = useNavigate()
    const { comicId, pageIndex } = useParams()
    const comic = useMemo(() => getComicById(comicId), [comicId])

    if (!comic) {
        return (
            <main className="page page-reader">
                <section className="panel empty-state">
                    <h2>暂未找到对应章节</h2>
                    <button type="button" className="action-button" onClick={() => navigate('/')}>
                        返回首页
                    </button>
                </section>
            </main>
        )
    }

    const currentIndex = Math.min(Math.max(Number(pageIndex) || 0, 0), comic.pages.length - 1)
    const goTo = (nextIndex) => {
        if (nextIndex < 0 || nextIndex > comic.pages.length - 1) return
        navigate(`/reader/${comic.id}/${nextIndex}`)
    }

    return (
        <main className="page page-reader">
            <div className="panel reader-viewer">
                <div className="panel-header" style={{ width: '100%' }}>
                    <button type="button" className="text-button" onClick={() => navigate(`/detail/${comic.id}`)}>
                        ← 返回详情
                    </button>
                    <span className="hint">
                        第 {currentIndex + 1} / {comic.pages.length} 张
                    </span>
                </div>
                <div className="reader-stage">
                    <button
                        type="button"
                        className="reader-nav is-prev"
                        disabled={currentIndex === 0}
                        onClick={() => goTo(currentIndex - 1)}
                        aria-label="上一张"
                    >
                        ← 上一张
                    </button>
                    <img src={comic.pages[currentIndex]} alt={`${comic.title} - page ${currentIndex + 1}`} />
                    <button
                        type="button"
                        className="reader-nav is-next"
                        disabled={currentIndex === comic.pages.length - 1}
                        onClick={() => goTo(currentIndex + 1)}
                        aria-label="下一张"
                    >
                        下一张 →
                    </button>
                </div>
            </div>
        </main>
    )
}

