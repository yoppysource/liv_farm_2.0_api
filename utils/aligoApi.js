const aligoapi = require("aligoapi");
const dotenv = require("dotenv");

let AuthData = {
  apikey: process.env.ALIGO_API_KEY,
  userid: "futureconnect",
  token: "",
};
// token을 제외한 인증용 데이터는 모든 API 호출시 필수값입니다.
// token은 토큰생성을 제외한 모든 API 호출시 필수값입니다.

const kakaoTemplateCode = "TE_2986";

// const getAuthData = async (req, res) => {
//   console.log("get Auth");
//   req.body = {
//     type: "m",
//     time: 1,
//   };

//   let data = await aligoapi.token(req, AuthData);
//   data = JSON.parse(data);

//   if (data.code != 0)
//     return next(new AppError("Fail to get Token from Aligo", 400));

//   const authData =
//   return authData;
// };

exports.sendAlimtalk = async (req, res) => {
  // 알림톡 전송
  console.log("get Auth");
  req.body = {
    type: "m",
    time: 1,
  };

  let data = await aligoapi.token(req, AuthData);
  console.log(data);
  if (data.code != 0)
    return next(new AppError("Fail to get Token from Aligo", 400));

  AuthData.token = data.token;

  req.body = {
    senderkey: process.env.ALIGO_SENDER_KEY,
    tpl_code: "TE_2986",
    sender: "01033388179",
    receiver_1: req.data.buyerTel,
    subject_1: "주문알림",
    message_1: `[LivFarm] 주문완료안내
    안녕하세요, ${req.data.buyer_name}님. 리브팜에서 주문해주셔서 감사합니다. 배송 예정시간에 맞게 갓 수확한 채소를 신선하게 보내드리겠습니다.
    □ 주문명 : ${req.data.name}
    □ 배송지 : ${req.data.buyer_addr}
    □ 배송예정일 : ${req.data.customData.scheduledDate}
    □ 결제금액 : ${req.data.amount}원`,
    // senddate: 예약일 // YYYYMMDDHHMMSS
    recvname: "리브팜",
    // button: 버튼 정보 // JSON string,
    failover: "N", // Y or N
    // fsubject: 실패시 대체문자 제목
    // fmessage: 실패시 대체문자 내용
  };

  // req.body 요청값 예시입니다.
  // _로 넘버링된 최대 500개의 receiver, subject, message, button, fsubject, fmessage 값을 보내실 수 있습니다
  // failover값이 Y일때 fsubject와 fmessage값은 필수입니다.
  console.log(req.body);
  aligoapi
    .alimtalkSend(req, AuthData)
    .then((r) => {
      console.log(r);
      // res.send(r)
    })
    .catch((e) => {
      console.log(e);
      // res.send(e)
    });
};
const profileAuth = (req, res) => {
  // 플러스친구 - 인증요청

  // req.body = {
  /*** 필수값입니다 ***/
  // plusid: 플러스친구 아이디(@포함)
  // phonenumber: 관리자 핸드폰 번호
  /*** 필수값입니다 ***/
  // }
  // req.body 요청값 예시입니다.
  // phonenumber로 인증번호가 발송됩니다

  aligoapi
    .profileAuth(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

const profileCategory = (req, res) => {
  // 플러스친구 - 카테고리 조회

  aligoapi
    .profileCategory(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

const profileAdd = (req, res) => {
  // 플러스친구 - 친구등록 심사요청

  // req.body = {
  /*** 필수값입니다 ***/
  // plusid: 플러스친구 아이디(@포함)
  // authnum: 인증번호
  // phonenumber: 관리자 핸드폰 번호
  // categorycode: 카테고리 코드
  /*** 필수값입니다 ***/
  // }
  // req.body 요청값 예시입니다.
  // 플러스친구 - 인증요청의 phonenumber로 발송된 인증번호를 authnum값으로 보내세요
  // 플러스친구 - 카테고리 조회의 thirdBusinessType 값을 categorycode값으로 보내세요

  aligoapi
    .profileAdd(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

const friendList = (req, res) => {
  // 플러스친구 - 등록된 플러스친구 리스트

  // req.body = {
  // plusid: 플러스친구 아이디(@ 포함)
  // senderkey: 발신프로필 키
  // }
  // req.body 요청값 예시입니다.

  aligoapi
    .friendList(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

const templateList = (req, res) => {
  // 템플릿관리 - 템플릿 리스트

  // req.body = {
  /*** 필수값입니다 ***/
  // senderkey: 발신프로필 키
  /*** 필수값입니다 ***/
  // tpl_code: 템플릿 코드
  // }
  // req.body 요청값 예시입니다.

  aligoapi
    .templateList(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

const templateAdd = (req, res) => {
  // 템플릿관리 - 템플릿 등록

  // req.body = {
  /*** 필수값입니다 ***/
  // senderkey: 발신프로필 키
  // tpl_name: 템플릿 이름
  // tpl_content: 템플릿 내용 // (최대 1,000자)
  /*** 필수값입니다 ***/
  // tpl_button: 템플릿 버튼
  // }
  // req.body 요청값 예시입니다.

  aligoapi
    .templateAdd(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

const templateModify = (req, res) => {
  // 템플릿관리 - 템플릿 수정

  // req.body = {
  /*** 필수값입니다 ***/
  // senderkey: 발신프로필 키
  // tpl_code: 템플릿 코드
  // tpl_name: 템플릿 이름
  // tpl_content: 템플릿 내용 // (최대 1,000자)
  /*** 필수값입니다 ***/
  // tpl_button: 템플릿 버튼
  // }
  // req.body 요청값 예시입니다.

  aligoapi
    .templateModify(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

const templateDel = (req, res) => {
  // 템플릿관리 - 템플릿 삭제

  // req.body = {
  /*** 필수값입니다 ***/
  // senderkey: 발신프로필 키
  // tpl_code: 템플릿 코드
  /*** 필수값입니다 ***/
  // }
  // req.body 요청값 예시입니다.

  aligoapi
    .templateDel(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

const templateRequest = (req, res) => {
  // 템플릿관리 - 템플릿 검수요청

  // req.body = {
  /*** 필수값입니다 ***/
  // senderkey: 발신프로필 키
  // tpl_code: 템플릿 코드
  /*** 필수값입니다 ***/
  // }
  // req.body 요청값 예시입니다.

  aligoapi
    .templateRequest(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

const alimtalkSend = (req, res) => {
  aligoapi
    .alimtalkSend(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

const historyList = (req, res) => {
  // 전송결과보기

  // req.body = {
  // page: 페이지번호 // 기본1
  // limit: 페이지당 출력 갯수 // (기본 50) 최대 500
  // start_date: 조회시작일자 // 기본 최근일자 // YYYYMMDD
  // enddate: 조회마감일자 // YYYYMMDD
  // }
  // req.body 요청값 예시입니다.

  aligoapi
    .historyList(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

const historyDetail = (req, res) => {
  // 전송결과보기 상세

  // req.body = {
  /*** 필수값입니다 ***/
  // mid: 메세지 고유ID
  /*** 필수값입니다 ***/
  // page: 페이지번호 // 기본1
  // limit: 페이지당 출력 갯수 // (기본 50) 최대 500
  // start_date: 조회시작일자 // 기본 최근일자 // YYYYMMDD
  // enddate: 조회마감일자 // YYYYMMDD
  // }
  // req.body 요청값 예시입니다.

  aligoapi
    .historyDetail(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

const kakaoRemain = (req, res) => {
  // 발송가능건수

  aligoapi
    .kakaoRemain(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

const kakaoCancel = (req, res) => {
  // 예약취소

  // req.body = {
  /*** 필수값입니다 ***/
  // mid: 메세지 고유ID
  /*** 필수값입니다 ***/
  // }
  // req.body 요청값 예시입니다.

  aligoapi
    .kakaoCancel(req, AuthData)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};

// module.exports = {
//   token,
//   friendList,
//   profileAuth,
//   profileCategory,
//   profileAdd,
//   templateList,
//   templateAdd,
//   templateModify,
//   templateDel,
//   templateRequest,
//   alimtalkSend,
//   historyList,
//   historyDetail,
//   kakaoRemain,
//   kakaoCancel,
// };
