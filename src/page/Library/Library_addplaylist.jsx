import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Searchbar from "../../components/Home/Searchbar";
import Nav from "../../components/Nav";
import SubHeader from "../../components/SubHeader";
import searchicon from '../../assets/img/nav/search_g.svg'

const Library_addplaylist = () => {
    const location = useLocation();

    // ✅ playlist에서 넘어온 값
    const playlistId = location.state?.playlistId || null;
    const playlistTitle = location.state?.playlistTitle || "myplaylist";

    // 혹시 새로고침/직접접속 대비해서 querystring도 받을 거면:
    // const params = new URLSearchParams(location.search);
    // const playlistIdFromQs = params.get("playlistId");
    // const playlistId = location.state?.playlistId || playlistIdFromQs || null;

    const headerTitle = useMemo(() => `Add to '${playlistTitle}'`, [playlistTitle]);

    return (
        <div className="libraryaddplaylist_wrap">
            <div className="container">
                <SubHeader title={headerTitle} />

                <div className="lb_add_search">
                    <div id='Searchbar_Wrap'>
                        <div className="searchbar">
                            <div className="searchbar_content">
                                <img src={searchicon} alt="Search Icon" />
                                <input type="text" placeholder="Search" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lb_add_main">
                    {/* ✅ Musiclist를 데이터 없이 3개 렌더링하면 터질 수 있어.
              일단 안전하게 placeholder로 처리하고,
              나중에 검색 결과/트랙 데이터를 가져오면 그때 Musiclist를 렌더링해. */}
                    {!playlistId ? (
                        <p style={{ padding: 16 }}>플레이리스트 정보가 없어. 이전 화면에서 다시 진입해줘.</p>
                    ) : (
                        <p style={{ padding: 16 }}>
                            여기에 검색 결과가 나오고, 선택한 곡을 playlistId({playlistId})에 추가하면 돼.
                        </p>
                    )}
                </div>
            </div>

            <Nav />
        </div>
    );
};

export default Library_addplaylist;