import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { comics } from './mockData'
import './display.css'

const optionMap = {
    authors: [...new Set(comics.flatMap((item) => item.authors))],
    categories: [...new Set(comics.flatMap((item) => item.categories))],
    tags: [...new Set(comics.flatMap((item) => item.tags))]
}

const FilterGroup = ({ label, options, selected, onToggle }) => (
    <div className="filter-group">
        <strong>{label}</strong>
        <div className="filter-options">
            {options.map((option) => (
                <button
                    type="button"
                    key={option}
                    className={`filter-chip ${selected.includes(option) ? 'is-active' : ''}`}
                    onClick={() => onToggle(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    </div>
)

export default function Home() {
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState('')
    const [authors, setAuthors] = useState([])
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])

    const hasFilter = keyword.trim() || authors.length || categories.length || tags.length

    const filteredComics = useMemo(() => {
        const lower = keyword.trim().toLowerCase()
        return comics.filter((comic) => {
            const matchesKeyword = lower
                ? [comic.title, ...comic.authors, ...comic.categories, ...comic.tags, comic.description]
                      .join(' ')
                      .toLowerCase()
                      .includes(lower)
                : true
            const matchesAuthors = authors.length ? authors.every((item) => comic.authors.includes(item)) : true
            const matchesCategories = categories.length ? categories.every((item) => comic.categories.includes(item)) : true
            const matchesTags = tags.length ? tags.every((item) => comic.tags.includes(item)) : true
            return matchesKeyword && matchesAuthors && matchesCategories && matchesTags
        })
    }, [keyword, authors, categories, tags])

    const handleToggle = (value, setter) => {
        setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
    }

    const resetFilters = () => {
        setKeyword('')
        setAuthors([])
        setCategories([])
        setTags([])
    }

    return (
        <main className="page page-home">
            <section className="panel">
                <h1 className="heading">前台展示 · 漫画探索</h1>
                <p className="hint">支持根据标题、作者、分类、标签组合筛选，点击卡片查看详情。</p>

                <div className="search-panel">
                    <div className="search-row">
                        <input
                            placeholder="输入标题 / 作者关键字"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="action-button"
                            disabled={!hasFilter}
                            onClick={resetFilters}
                        >
                            清空筛选
                        </button>
                    </div>

                    <FilterGroup
                        label="作者"
                        options={optionMap.authors}
                        selected={authors}
                        onToggle={(value) => handleToggle(value, setAuthors)}
                    />
                    <FilterGroup
                        label="分类"
                        options={optionMap.categories}
                        selected={categories}
                        onToggle={(value) => handleToggle(value, setCategories)}
                    />
                    <FilterGroup
                        label="标签"
                        options={optionMap.tags}
                        selected={tags}
                        onToggle={(value) => handleToggle(value, setTags)}
                    />
                </div>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <h2>漫画九宫格</h2>
                    <span className="hint">共 {filteredComics.length} 部作品</span>
                </div>

                {filteredComics.length === 0 && <div className="empty-state">暂无符合条件的作品，试试调整筛选条件。</div>}

                <div className="grid">
                    {filteredComics.map((comic) => (
                        <button
                            type="button"
                            key={comic.id}
                            className="comic-card"
                            onClick={() => navigate(`/detail/${comic.id}`)}
                        >
                            <img src={comic.cover} alt={comic.title} loading="lazy" />
                            <h3>{comic.title}</h3>
                            <div className="badge-row">
                                {comic.categories.map((cat) => (
                                    <span className="badge" key={cat}>
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </main>
    )
}