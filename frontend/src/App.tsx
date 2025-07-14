import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import SurveyList from "./pages/SurveyList";
import Survey from "./pages/Survey";
import Result from "./pages/Result";
import { initializeConfig } from "./config";
import "./App.css";

function App() {
  useEffect(() => {
    // 앱 시작 시 환경 설정 초기화
    initializeConfig();
  }, []);

  return (
    <Router>
      <div className='App'>
        <Header />
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/surveys' element={<SurveyList />} />
            <Route path='/survey/:type' element={<Survey />} />
            <Route path='/result' element={<Result />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
