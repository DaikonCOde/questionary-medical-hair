// hooks
import { useState, useEffect } from "react";
// data
import data from "../../db/data.json";
// components
import ProgressBar from "../../Components/ProgressBar/ProgressBar";
import OptionsSelect from "../../Components/OptionsSelect/OptionsSelect";
import SearchClinics from "../../Components/SearchClinics/SearchClinics";
import Loader from "../../Components/Loader/Loader";

import ContactForm from "../../Components/ContactForm/ContactForm";

import ArrowBack from "../../assets/arrow-prev.svg";
import "./Home.style.scss";
import MoreInfo from "../../Components/MoreInfo/MoreInfo";

function Home() {
  const [stateQuestions, setStateQuestions] = useState({
    index_question: 0,
    answers: [],
  });
  const [answerParse, setAnswerParse] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [goBack, setGoBack] = useState(false);
  const [changeRender, setChangeRender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [values, setValues] = useState({});

  useEffect(() => {
    if (isSearching) {
      setTimeout(() => {
        setIsSearching(false);
        setIsLoading(true);
      }, 3000);
    }

    if (isLoading) {
      setTimeout(() => {
        AnswersParse();
        setIsLoading(false);
        setShowContactForm(true);
      }, 3000);
    }
  }, [isSearching, isLoading]);

  useEffect(() => {
    if (goBack && !changeRender) {
      setTimeout(() => {
        setStateQuestions((prev) => ({
          ...prev,
          index_question: prev.index_question - 1,
        }));
        setChangeRender(true);
      }, 500);
    }
  }, [changeRender, goBack]);

  const handleSelectedOption = (id) => {
    const stateClone = Object.assign({}, stateQuestions);
    if (goBack && changeRender) {
      setChangeRender(false);
      setGoBack(false);
    }

    if (stateQuestions.index_question === data.questions.length - 1) {
      setShowExtra(true);
    }

    if (
      stateQuestions.answers[stateQuestions.index_question] === undefined ||
      stateQuestions.answers.length === 1
    ) {
      stateClone.index_question = stateClone.index_question + 1;
      stateClone.answers = [...stateClone.answers, id];

      return setStateQuestions(stateClone);
    }

    if (stateQuestions.answers.length > 1) {
      const firstOptions = stateQuestions.answers.slice(
        0,
        stateQuestions.index_question
      );
      const lastOptions = stateQuestions.answers.slice(
        stateQuestions.index_question + 1
      );

      (stateClone.index_question = stateClone.index_question + 1),
        (stateClone.answers = firstOptions.concat([id].concat(lastOptions)));

      return setStateQuestions(stateClone);
    }
  };

  const handlePreviousQuestion = () => {
    setGoBack(true);
    setChangeRender(false);
  };

  const AnswersParse = () => {
    const objectWithAnswers = {};

    const GetAnswerFistQuestion = () => {
      switch (stateQuestions.answers[0]) {
        case 1:
          return "Grado 3, entradas";
        case 2:
          return "Grado 5, entradas y coronilla";
        case 3:
          return "Grado 7, calvo total";
        case 4:
          return "Mi cabello perdido es diferente";
        default:
          return "";
      }
    };

    objectWithAnswers[0] = {
      label: data.questions[0].label,
      answer: GetAnswerFistQuestion(),
    };

    for (let i = 1; i < data.questions.length; i++) {
      const extraValues = Object.keys(values);
      let answer = "";

      // si el id de la pregunta no esta incluida en el objeto de values
      if (!extraValues.includes(stateQuestions.answers[i].toString())) {
        answer = data.questions[i].options.filter(
          (option) => option.id === stateQuestions.answers[i]
        )[0].label;
      } else {
        answer = values[stateQuestions.answers[i]];
      }

      objectWithAnswers[i] = {
        label: data.questions[i].label,
        answer: answer,
      };
    }

    setAnswerParse(objectWithAnswers);
  };

  const handleChangeInput = (e) => {
    const { value, name } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="home-page">
      <div className="content-form">
        {stateQuestions.index_question <= data.questions.length - 1 && (
          <div className="header-form">
            <ProgressBar
              totalQuestions={data.questions.length}
              index={stateQuestions.index_question}
            />
          </div>
        )}
        <div
          className="body-form"
          style={{ background: showContactForm ? "#fff" : "" }}
        >
          {/* titulo de la pregunta */}
          <div className="content-question-label">
            {stateQuestions.index_question <= data.questions.length - 1 && (
              <>
                {!!stateQuestions.index_question && (
                  <span className="back" onClick={handlePreviousQuestion}>
                    <img src={ArrowBack} alt="" />
                  </span>
                )}
                <h3 className="question-label">
                  {data.questions[stateQuestions.index_question].label}
                </h3>
              </>
            )}
          </div>

          {/* opciones */}
          {stateQuestions.index_question <= data.questions.length - 1 && (
            <OptionsSelect
              questions={data.questions[stateQuestions.index_question]}
              handleSelectedOption={handleSelectedOption}
              response={stateQuestions.answers[stateQuestions.index_question]}
              index={stateQuestions.index_question}
              goBack={goBack}
              changeRender={changeRender}
              valuesChange={handleChangeInput}
              values={values}
            />
          )}

          {showExtra && (
            <MoreInfo
              value={values.campo_opcional}
              handleChange={handleChangeInput}
              findClinics={() => {
                setIsSearching(true);
                setShowExtra(false);
              }}
            />
          )}

          {!showContactForm &&
            stateQuestions.index_question > data.questions.length - 1 &&
            !showExtra && (
              <div className="content-search">
                {isSearching && <SearchClinics />}
                {isLoading && <Loader />}
              </div>
            )}

          {showContactForm && <ContactForm answer={answerParse} />}
        </div>
      </div>
    </div>
  );
}

export default Home;
