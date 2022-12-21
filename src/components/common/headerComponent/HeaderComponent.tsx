import * as React from "react";
import { Link, PageProps } from "gatsby";
import { useState, useEffect } from "react";
import { GITHUB_URL, LOGO_IMG_URL, LOGO_TEXT } from "../../../constant/constant";
import recentPostsData, { recentPostDataType, recentPostsDataType } from '../../layout/recentComponent/recentPostsData';
import { initialFilterKeyState } from "./filterKey";

// style
import '../../../styles/header.sass';

const HeaderComponent: React.FC<PageProps> = ({ 
    path 
}: PageProps) => {

    const [scrollPosition, setScrollPosition] = useState<number>(0);

    // focus event
    const [filterFocus, setfilterFocus] = useState<boolean>(false);

    // search
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchedPosts, setSearchedPosts] = useState<recentPostsDataType>([]);

    // filter tag
    const [seletedTag, setSeletedTag] = useState<string>("");
    const [notSeletedTags, setNotSeletedTags] = useState<string[]>(initialFilterKeyState);

    // update scroll
    useEffect(() => {
        const updateScroll = () => {
            setScrollPosition(window.scrollY || document.documentElement.scrollTop);
        }
        window.addEventListener('scroll', updateScroll);
    }, []);

    // search functions
    useEffect(() => {
        const filteredPosts = recentPostsData.filter((data: recentPostDataType) =>
            data.title.toUpperCase().includes(searchValue.toUpperCase()) && searchValue.length
        )
        setSearchedPosts(filteredPosts);
    }, [searchValue])
 
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    // filter Focus Toggle
    const filterClick = () => {
        setfilterFocus(isFocus => !isFocus);
    }

    // notSeletedTags Tag Click Event
    const tagClick = (tag: string) => {
        let taglist: string[] = [...initialFilterKeyState];
        var index: number = taglist.indexOf(tag);
        if (index !== -1) {
            taglist.splice(index, 1);
        }
        setNotSeletedTags([...taglist]);
        setSeletedTag(tag);
    }

    // not seleted tags 
    const notSeletedTagsMap = notSeletedTags.map((tag: string) => (
        <Link to={`/?f=${tag}`}>
            <span onClick={() => tagClick(tag)}>{tag}</span>
        </Link>
    ))

    // filter tags backup
    const reset = () => {
        setSeletedTag('');
        setNotSeletedTags([...initialFilterKeyState]);
    }

    return (
        <header className={path == '/postitem' ? "notfixed" : scrollPosition < 50 ? "original" : "change"}>
            <div className="head index">
                <Link to="../">
                    <div className="head box">
                        <img className="logo" src={LOGO_IMG_URL} alt="logo"></img>
                        <span>{LOGO_TEXT}</span>
                    </div>
                </Link>
                <div className="search warp">
                    <input type="text"
                        className="search-input"
                        name="search"
                        autoComplete="off"
                        placeholder="검색할 내용을 입력하세요"
                        onChange={onChange}
                        value={searchValue}>
                    </input>
                    {
                        searchValue ?
                            <div className="searchBox">
                                <div className="search_post">
                                    {
                                        searchedPosts.length ?
                                            searchedPosts.map((searchPost: recentPostDataType) =>
                                                <Link to={`postitem/?name=${searchPost.filename}`} key={searchPost.id}>
                                                    <span>{searchPost.title}</span>
                                                </Link>
                                            ) :
                                            <span>검색 결과가 없습니다.</span>
                                    }
                                </div>
                            </div> : null
                    }
                </div>
                <div className="filter wrap">
                    <div className="filter wrap" onClick={filterClick}>
                        {filterFocus ? <div className="filter img click"></div> : <div className="filter img"></div>}
                        <div className="filter text">필터설정</div>
                    </div>
                    {filterFocus ?
                        <div className="filterBox">
                            <div className="left">
                                <div>적용됨</div>
                                {seletedTag && <Link to={`/`}><span onClick={reset}>{seletedTag}</span></Link>}
                            </div>
                            <div className="right">
                                <div>태그 목록</div>
                                {notSeletedTagsMap}
                            </div>
                        </div>
                        : null
                    }
                </div>
            </div>
            <div className="head content">
                <Link to="/intro">
                    <span>소개</span>
                </Link>
                <a href={GITHUB_URL}>
                    <span>깃허브</span>
                </a>
                <Link to="/login">
                    <span>Github 로그인</span>
                </Link>
                {/* <div className="mod">
                    <div className="circle"></div>
                </div> */}
            </div>
        </header>
    )
}

export default HeaderComponent;