const cover = (seed) => `https://picsum.photos/seed/${seed}/480/640`
const page = (seed, count = 9) =>
    Array.from({ length: count }, (_, idx) => `https://picsum.photos/seed/${seed}-${idx}/960/1360`)

export const comics = [
    {
        id: 'c-001',
        title: '星舰纪元',
        categories: ['科幻', '冒险'],
        authors: ['江临', '夏禾'],
        tags: ['连载', '全彩'],
        description: '年轻舰长带领船员深入未知星域，揭开文明更迭之谜。',
        cover: cover('starship-era'),
        pages: page('c001')
    },
    {
        id: 'c-002',
        title: '灵境侦探社',
        categories: ['悬疑', '都市'],
        authors: ['白墨'],
        tags: ['单元剧', '脑洞'],
        description: '三个少年少女利用灵视能力，解决城市里离奇的委托。',
        cover: cover('spirit-detective'),
        pages: page('c002', 8)
    },
    {
        id: 'c-003',
        title: '风笺录',
        categories: ['古风', '恋爱'],
        authors: ['沈沐', '顾音'],
        tags: ['古装', '唯美'],
        description: '一封家书牵出江湖往事，琴师与女侠并肩破局。',
        cover: cover('wind-diary'),
        pages: page('c003')
    },
    {
        id: 'c-004',
        title: '重启地平线',
        categories: ['科幻', '末日'],
        authors: ['唐一'],
        tags: ['废土', '群像'],
        description: '末日余生者寻找「地平线节点」，试图改写毁灭的未来。',
        cover: cover('reboot-horizon'),
        pages: page('c004', 10)
    },
    {
        id: 'c-005',
        title: '深海笔记',
        categories: ['冒险', '奇幻'],
        authors: ['顾澜'],
        tags: ['怪谈', '海洋'],
        description: '潜艇记者记录海沟异象，和失踪的父亲逐渐接近。',
        cover: cover('abyss-notes'),
        pages: page('c005')
    },
    {
        id: 'c-006',
        title: '月光便利店',
        categories: ['治愈', '都市'],
        authors: ['秋笙'],
        tags: ['温情', '生活流'],
        description: '凌晨的便利店是情绪的驿站，每位客人都带着秘密而来。',
        cover: cover('moonlight-store'),
        pages: page('c006', 7)
    },
    {
        id: 'c-007',
        title: '机械花园',
        categories: ['蒸汽', '冒险'],
        authors: ['林逐', '乐言'],
        tags: ['机械', '成长'],
        description: '孤儿与会开花的机械种子踏上旅程，寻找失落的匠师。',
        cover: cover('mechanic-garden'),
        pages: page('c007')
    },
    {
        id: 'c-008',
        title: '昼夜裁缝',
        categories: ['奇幻', '都市'],
        authors: ['楚辞'],
        tags: ['服饰', '设定控'],
        description: '能缝制情绪的裁缝，在白天与夜晚间自由穿梭。',
        cover: cover('tailor-day-night'),
        pages: page('c008', 6)
    },
    {
        id: 'c-009',
        title: '荒原骑士',
        categories: ['动作', '冒险'],
        authors: ['戚夏'],
        tags: ['热血', '机甲'],
        description: '失落王国的骑士驾驶机甲守护部族，守卫最后绿洲。',
        cover: cover('desert-knight'),
        pages: page('c009', 9)
    }
]

export const getComicById = (id) => comics.find((item) => item.id === id)

