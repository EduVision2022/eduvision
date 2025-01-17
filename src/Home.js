import { React, useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUser, selectUsername, selectObject } from "./userSlice";
import { useRef } from "react";
import dayjs from "dayjs";
import { useHistory } from "react-router-dom";

// Mantine UI Imports
import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  Transition,
  Box,
  Paper,
  Progress,
  THEME_ICON_SIZES,
  MultiSelect,
  Stack,
} from "@mantine/core";
import { Check, InfoCircle, Webhook, WorldLatitude } from "tabler-icons-react";
import image from "./image.svg";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Sun, MoonStars } from "tabler-icons-react";
import { Header, Burger, Center } from "@mantine/core";
import { useBooleanToggle, useSetState } from "@mantine/hooks";
import {
  BrandTwitter,
  BrandYoutube,
  BrandInstagram,
  HeartMinus,
  TiltShift,
} from "tabler-icons-react";
import Theme from "./Theme";
import { Avatar } from "@mantine/core";
import { Notification } from "@mantine/core";
import { X } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { CircleCheck, CircleDashed } from "tabler-icons-react";
import { SimpleGrid } from "@mantine/core";
import { Divider } from "@mantine/core";
import { Timeline } from "@mantine/core";
import { DateRangePicker } from "@mantine/dates";
import { TimeInput } from "@mantine/dates";
import { TimeRangeInput } from "@mantine/dates";
import { Clock } from "tabler-icons-react";
import { Calendar } from "tabler-icons-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useListState } from "@mantine/hooks";
import { Stepper } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";

// Login Imports
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

// Image imports
import logoLight from "./images/logoLight.png";
import logoDark from "./images/logoDark.png";
import backgroundLight from "./images/defaultLight.png";
import backgroundDark from "./images/defaultDark.png";
import backgroundLightInverted from "./images/invertedLight.png";
import backgroundDarkInverted from "./images/invertedDark.png";

import { auth, SignInWithGoogle, logout } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { getFirestore, query, collection, where } from "firebase/firestore";
import { addDoc, getDocs } from "firebase/firestore";
import FeaturesImages from "./Features.tsx";

// Context imports
import { usePointsContext } from "./points.tsx";
import { useRefreshContext } from "./Refresh.tsx";

const firebaseConfig = {
  apiKey: "AIzaSyAYv-TF955BPhLNDpyU33_RXYOc_3JfAxo",
  authDomain: "fir-eduvision.firebaseapp.com",
  databaseURL:
    "https://fir-eduvision-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-eduvision",
  storageBucket: "fir-eduvision.appspot.com",
  messagingSenderId: "646268921365",
  appId: "1:646268921365:web:e87b17b5fa58292386101c",
  measurementId: "G-N4RKEE445C",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.2)
        : theme.colors[theme.primaryColor][0],
    borderRadius: theme.radius.sm,
    padding: "0px 6px",
  },

  top: {
    borderBottomRightRadius: "0px",
    borderBottomLeftRadius: "0px",
    borderColor: theme.colorScheme === "dark" ? "#25262b" : "#e6e6e6",
  },

  middle: {
    borderTop: "none",
    borderRadius: "0px",
    borderColor: theme.colorScheme === "dark" ? "#25262b" : "#e6e6e6",
  },

  bottom: {
    borderTop: "none",
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
    borderColor: theme.colorScheme === "dark" ? "#25262b" : "#e6e6e6",
  },
  item: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    borderRadius: theme.radius.md,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  symbol: {
    fontSize: 30,
    fontWeight: 700,
    width: 60,
  },
}));

function navigate(href, newTab) {
  var a = document.createElement("a");
  a.href = href;
  if (newTab) {
    a.setAttribute("target", "_blank");
  }
  a.click();
}

const Home = () => {
  const history = useHistory();

  const [pointsProvider, setPointsProvider] = usePointsContext();
  const [refreshValue, setRefreshValue] = useRefreshContext();

  const user = useSelector(selectUsername);
  const dispatch = useDispatch();

  const { scrollIntoView, targetRef } = useScrollIntoView();

  const [mountDouble, setMountDouble] = useState(false);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { classes, cx } = useStyles();

  const [loggedin, setLoggedin] = useState(false);

  const [progress, setProgress] = useState(0);

  const [pas, setPas] = useState(0);

  const [step, setStep] = useState(0);

  const [showBack, setShowBack] = useState(false);

  const [days, setDays] = useState([]);

  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [User, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", User?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setLoggedin(true);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchUserName();
  }, [User, loading]);
  console.log(refreshValue);

  const [Form, setForm] = useState({
    Buttons: {
      informatica: {
        variant: "outline",
        disabled: false,
      },
      chimie: {
        variant: "outline",
        disabled: false,
      },
      biologie: {
        variant: "outline",
        disabled: false,
      },
      fizica: {
        variant: "outline",
        disabled: false,
      },
    },
  });

  const [materie1, setMaterie1] = useState("romana");
  const [materie2, setMaterie2] = useState("matematica");
  const [materie3, setMaterie3] = useState("");

  class Ora {
    constructor(position, mass, symbol, name) {
      this.position = position;
      this.mass = mass;
      this.symbol = symbol;
      this.name = name;
    }
  }

  const [state, handlers] = useListState(data2);

  var data2 = [];
  data2[0] = new Ora("1", "1.0079", "MT", "Matematică");
  data2[1] = new Ora("2", "4.0026", "RM", "Română");

  const ToggleFormButton = (name) => {
    if (name == "informatica") {
      if (Form.Buttons.informatica.variant == "outline") {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "light",
              disabled: false,
            },
          },
        }));
        handlers.pop();
        handlers.pop();
        handlers.pop();
        handlers.append(
          data2[0],
          data2[1],
          new Ora("1", "1.0079", "I", "Informatică")
        );
        setMaterie3("informatica");
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
              disabled: true,
            },
          },
        }));
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
              disabled: false,
            },
          },
        }));
      }
    }
    if (name == "chimie") {
      if (Form.Buttons.chimie.variant == "outline") {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "light",
              disabled: false,
            },
          },
        }));
        handlers.pop();
        handlers.pop();
        handlers.pop();
        handlers.append(
          data2[0],
          data2[1],
          new Ora("1", "1.0079", "C", "Chimie")
        );
        setMaterie3("chimie");
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
              disabled: true,
            },
          },
        }));
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
              disabled: false,
            },
          },
        }));
      }
    }
    if (name == "biologie") {
      if (Form.Buttons.biologie.variant == "outline") {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "light",
              disabled: false,
            },
          },
        }));
        handlers.pop();
        handlers.pop();
        handlers.pop();
        handlers.append(
          data2[0],
          data2[1],
          new Ora("1", "1.0079", "B", "Biologie")
        );
        setMaterie3("biologie");
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
              disabled: true,
            },
          },
        }));
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
              disabled: false,
            },
          },
        }));
      }
    }
    if (name == "fizica") {
      if (Form.Buttons.fizica.variant == "outline") {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "light",
              disabled: false,
            },
          },
        }));
        handlers.pop();
        handlers.pop();
        handlers.pop();
        handlers.append(
          data2[0],
          data2[1],
          new Ora("1", "1.0079", "F", "Fizică")
        );
        setMaterie3("fizica");
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
              disabled: true,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
              disabled: true,
            },
          },
        }));
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            fizica: {
              ...prevForm.Buttons.fizica,
              variant: "outline",
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            informatica: {
              ...prevForm.Buttons.informatica,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            biologie: {
              ...prevForm.Buttons.biologie,
              variant: "outline",
              disabled: false,
            },
          },
        }));
        setForm((prevForm) => ({
          ...prevForm,
          Buttons: {
            ...prevForm.Buttons,
            chimie: {
              ...prevForm.Buttons.chimie,
              variant: "outline",
              disabled: false,
            },
          },
        }));
      }
    }
  };

  const ditems = state.map((item, index) => (
    <Draggable index={index} draggableId={item.symbol} key={item.symbol}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Text className={classes.symbol}>{item.symbol}</Text>
          <div>
            <Text>{item.name}</Text>
            <Text color="dimmed" size="sm">
              Dificultate: {item.position} • Capitole: {item.mass}
            </Text>
          </div>
        </div>
      )}
    </Draggable>
  ));

  const now = new Date();
  const then = dayjs(now).add(30, "minutes").toDate();
  const [date, setDate] = useState([]);

  const [trans, setTrans] = useState(false);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const [currIntrebare, setCurrIntrebare] = useState(0);

  const [intrebariFinal, setIntrebariFinal] = useState([
    new Intrebare(
      "Romana",
      "Literatura",
      "Cine a scris Floare albastra?",
      ["Mihai Eminescu", "Ion Luca Caragiale", "Ion Creanga", "Ion Pillat"],
      1
    ),
  ]);

  function Intrebare(
    materie,
    capitol,
    intrebare,
    raspunsuri = [],
    raspunsCorect
  ) {
    this.materie = materie;
    this.capitol = capitol;
    this.intrebare = intrebare;
    this.raspunsuri = raspunsuri;
    this.raspunsCorect = raspunsCorect;
  }

  var intrebariRomana = [
    new Intrebare(
      "Romana",
      "Literatura",
      'Cine este purtătorul mesajului moralizator al nuvelei "Moara cu Noroc" ',
      ["Lică Sămădăul", "Soacra lui Ghiță", "Ghiță", "Ana"],
      2
    ),
    new Intrebare(
      "Romana",
      "Literatura",
      'Ce tip de opera este "Povestea lui Harap-Alb"?',
      ["Basm", "Nuvelă", "Roman", "Comedie"],
      1
    ),
    new Intrebare(
      "Romana",
      "Literatura",
      "Cine a scris Floare Albastra?",
      ["Ion Creanga", "Ioan Slavici", "Mihai Eminescu", "Ion Pillat"],
      3
    ),
    new Intrebare(
      "Romana",
      "Literatura",
      'Cine a scris "Povestea lui Harap-Alb"?',
      ["Ioan Slavici", "Ion Creanga", "Mihai Eminescu", "Ion Luca Caragiale"],
      2
    ),
  ];

  var intrebariMatematica = [
    new Intrebare(
      "Matematica",
      "Geometrie",
      "Ecuatia dreptei care trece prin punctele M(1,2) si N(2,5)  este:",
      ["2x + y = 2", "x = 0", "y = 3", "3x - y = 1"],
      4
    ),
    new Intrebare(
      "Matematica",
      "Geometrie",
      "Sa se determine coordonatele mijlocului segmentului AB, unde A(-3,4) si B(7,-2)",
      ["(2,1)", "(1,2)", "(7,-2)", "(-3,4)"],
      1
    ),
    new Intrebare(
      "Matematica",
      "Geometrie",
      "Aria cercului de diametru 2 este:",
      ["3π", "π;", "6π;", "4π;"],
      2
    ),
    new Intrebare(
      "Matematica",
      "Geometrie",
      "Daca x ≤ 3 - 2x atunci:",
      ["x ≤ -5 ", "x = 0 ", "x ≤ -11", "x ≤ 1 "],
      4
    ),
    new Intrebare(
      "Matematica",
      "Geometrie",
      "Solutia ecuatiei 5x-12=3x este:",
      ["-5", "6", "4", "5"],
      2
    ),
  ];

  var intrebariInformatica = [
    new Intrebare(
      "Informatica",
      "Expresii",
      "Indicați expresia C/C++ cu valoarea 0",
      ["sqrt(16)==4", "45*5==200+5*5", "25/10==15/10", "64/4==8*2"],
      3
    ),
    new Intrebare(
      "Informatica",
      "Granfuri",
      "Numim pădure un graf neorientat în care fiecare componentă conexă a sa este un arbore. Orice pădure cu cel putin doi arbori este un graf care:",
      [
        "Are cicluri şi este conex",
        "Are cicluri şi nu este conex",
        "Nu are cicluri şi este conex",
        "Nu are cicluri şi nu este conex",
      ],
      1
    ),
    new Intrebare(
      "Informatica",
      "Declararea variabilelor",
      "Alegeți declararea corectă a unei variabile structurale cu 2 componente, una de tip real și una de tip întreg.",

      [
        "int float x[10] ;",
        "struct { float x; int y} a;",
        "float a[20];",
        "struct { float x; int y} int a;",
      ],
      2
    ),
    new Intrebare(
      "Informatica",
      "Expresii",
      "Variabilele x și y sunt întregi. Indicați expresia C/C++ echivalentă cu (x<3)&&(y>=5).",
      [
        "!(!(x<3)||!(y>=5))",
        "!(x>=3)&&(y<5)",
        "!((x>=3)&&(y<5))",
        "!((x<3)||(y>=5))",
      ],
      1
    ),
    new Intrebare(
      "Informatica",
      "Grafuri",
      "Valorile care pot reprezenta gradele nodurilor unui graf neorientat, cu 6 noduri, sunt:",
      ["2,2,5,5,0,1", "6,5,4,3,2,1", "2,2,3,4,0,3", "1,0,0,2,2,2"],
      3
    ),
    new Intrebare(
      "Informatica",
      "Structuri repetitive",
      "Ce se afisează, în urma executării următoarelor instrucțiuni: int b[5]={88,87,76,36,21},i;for( i=1;i<4;i++){cout<<b[i]<<' ';}",
      [
        "87 76 36",
        "88 87 76 36 21",
        "87 76 36 21",
        "Secventa are erori de sintaxa.",
      ],
      1
    ),
    new Intrebare(
      "Informatica",
      "Matrici",
      "Variabilele i şi j sunt de tip întreg, iar variabila m memorează un tablou bidimensional cu 5 linii şi 5 coloane, numerotate de la 0 la 4, cu elemente numere întregi. O expresie C/C++ a cărei valoare este egală cu produsul dintre primul element de pe linia i și ultimul element de pe coloana j din acest tablou este:",
      ["m(0,i)*m(j,4)", "m(i)(0)*m(4)(j)", "m[i][0]*m[4][j]", "m[0,i]*m[j,4]"],
      3
    ),
    new Intrebare(
      "Informatica",
      "Backtracking",
      "Utilizând metoda backtracking se generează toate modalităţile de a scrie numărul 6 ca sumă de numere naturale impare. Termenii fiecărei sume sunt în ordine crescătoare. Cele patru soluţii sunt obţinute în această ordine: 1+1+1+1+1+1; 1+1+1+3; 1+5; 3+3. Aplicând acelaşi algoritm, numărul soluţiilor obţinute pentru scrierea lui 8 este:",
      ["9", "6", "5", "8"],
      2
    ),
  ];

  var intrebariChimie = [
    new Intrebare(
      "Chimie",
      "Hidrocarburi",
      "Simetria orbitalilor sp3 este:",
      ["cilindrica", "trigonala", "tetraedica", "planara"],
      3
    ),
    new Intrebare(
      "Chimie",
      "Hidrocarburi",
      "2-Pentena",
      [
        "Poate avea doi izomeri geometrici",
        "Nu este izomera de pozitie cu 1-pentena",
        "Nu se oxideaza cu bicromat de potasiu in prezenta acidului sulfuric",
        "Se nitreaza cu amestec sulfonitric",
      ],
      1
    ),
    new Intrebare(
      "Chimie",
      "Hidrocarburi",
      "O alchenă şi un cicloalcan cu catena liniară cu acelaşi număr de atomi de carbon au:",
      [
        "Acelasi punct de topire",
        "Acelasi indice de refractie",
        "Aceeasi formula moleculara",
        "Aceeasi stare de agregare",
      ],
      3
    ),
    new Intrebare(
      "Chimie",
      "Hidrocarburi",
      "Pentru un aminoacid nu se poate spune că:",
      [
        "Este natural dacă este alifatic şi este un α−aminoacid",
        "Este un aminoacid esenŃial dacă poate fi produs de organismul uman",
        "Este acidul asparagic dacă este acidul α-aminosuccinic",
        "Are un caracter de amfiion",
      ],
      2
    ),
    new Intrebare(
      "Chimie",
      "Hidrocarburi",
      "Următoarea reactia nu este o reactie de halogenare:",
      [
        "Aditia bromului la 2-pentenă",
        "Reactia toluenului cu clorura de acetil",
        "Bromurarea fotochimică a metanului",
        "Reactia dintre alcoolul tert-butilic şi acidul clorhidric.",
      ],
      2
    ),
  ];

  var intrebariFizica = [
    new Intrebare(
      "Fizica",
      "Mecanică",
      "Un camion parcurge un sfert din drumul său cu viteza v1 = 30 km/h, iar restul drumului cu viteza v2 = 60 km/h. Viteza medie a camionului pe întreaga distantă parcursă are valoarea:",
      ["90 km/h", "50 km/h", "48 km/h", "45 km/h"],
      3
    ),
    new Intrebare(
      "Fizica",
      "Mecanică",
      "Un avion având masa m = 10t decolează de pe un aeroport situat la nivelul mării și ajunge la altitudinea h = 6000m. Variația energiei potențiale datorate interacțiunii gravitaționale avion-Pământ este de aproximativ:",
      ["10^8 J", "3kJ", "6MJ", "600MJ"],
      4
    ),
    new Intrebare(
      "Fizica",
      "Mecanică",
      "Asupra unui resort elastic acționează la ambele extremități, în sensuri contrare, câte o forță având modulul egal cu 30N. Alungirea resortului este egală cu 5cm. Constanta elastică a resortului este egală cu:",
      ["1200 N/m", "600 N/m", "150 N/m", "6 N/m"],
      2
    ),
    new Intrebare(
      "Fizica",
      "Termodinamică",
      "Considerând că simbolurile mărimilor fizice și convențiile de semne pentru căldură și lucru mecanic sunt cele utilizate în manualele de fizică, expresia corectă a principiului I al termodinamicii este:",
      ["U = Q + L", "ΔU = Q + L", "ΔU = Q - L", "U = Q - L"],
      3
    ),
    new Intrebare(
      "Fizica",
      "Termodinamică",
      "Într-o destindere adiabatică a unei mase constante de gaz ideal, densitatea acestuia:",
      ["crește", "scade", "rămâne constantă", "crește și apoi scade"],
      2
    ),
    new Intrebare(
      "Fizica",
      "Termodinamică",
      "Unitatea de măsură a raportului dintre capacitatea calorică a unei bile de fier și căldura specifică a fierului este:",
      ["J/K", "kg/mol", "kg", "mol"],
      3
    ),
  ];

  var intrebariBiologie = [
    new Intrebare(
      "Biologie",
      "Funcțiile fundamentale ale organismelor",
      "Atriul stang comunica cu ventricului stang printr-un orificiu prevaut cu valva/valvula:",
      ["Semilunara", "Bicuspida", "Sigmoida", "Tricuspida"],
      2
    ),
    new Intrebare(
      "Biologie",
      "Funcțiile fundamentale ale organismelor",
      "Substanța aflată în plasmă care are rol în coagulare este:",
      ["Fibrinogenul", "Colesterolul", "Glucoza", "Toate substanele enumerate"],
      1
    ),
    new Intrebare(
      "Biologie",
      "Funcțiile fundamentale ale organismelor",
      "Ce orificiu se află între esofag și stomac?",
      ["Pilor", "Cardia", "Sfincter", "Nu se află niciun orificiu"],
      2
    ),
    new Intrebare(
      "Biologie",
      "Funcțiile fundamentale ale organismelor",
      "Alegeți afirmația adevărată referitoare la schimbul de gaze:",
      [
        "Este un proces activ",
        "O2 trece din sange in alveola",
        "CO2 trece din alveola in sange",
        "Se realizeaza prin difuziune",
      ],
      4
    ),
    new Intrebare(
      "Biologie",
      "Funcțiile fundamentale ale organismelor",
      "Sunt căi urinare intrarenale:",
      ["Ureterele", "Tubii colectori", "Vezica urinara", "Uretra"],
      2
    ),
  ];

  var priority = [];

  function SetMaterii(input) {
    if (input == "informatica") {
      if (state[0].name == "Informatică") {
        if (state[1].name == "Română") {
          setIntrebariFinal([
            ...intrebariInformatica,
            ...intrebariRomana,
            ...intrebariMatematica,
          ]);
        } else {
          setIntrebariFinal([
            ...intrebariInformatica,
            ...intrebariMatematica,
            ...intrebariRomana,
          ]);
        }
      } else {
        if (state[0].name == "Română") {
          if (state[1].name == "Matematică") {
            setIntrebariFinal([
              ...intrebariRomana,
              ...intrebariMatematica,
              ...intrebariInformatica,
            ]);
          } else {
            setIntrebariFinal([
              ...intrebariRomana,
              ...intrebariInformatica,
              ...intrebariMatematica,
            ]);
          }
        } else if (state[0].name == "Matematică") {
          if (state[1].name == "Română") {
            setIntrebariFinal([
              ...intrebariMatematica,
              ...intrebariRomana,
              ...intrebariInformatica,
            ]);
          } else {
            setIntrebariFinal([
              ...intrebariMatematica,
              ...intrebariInformatica,
              ...intrebariRomana,
            ]);
          }
        }
      }
    } else if (input == "chimie") {
      if (state[0].name == "Chimie") {
        if (state[1].name == "Română") {
          setIntrebariFinal([
            ...intrebariChimie,
            ...intrebariRomana,
            ...intrebariMatematica,
          ]);
        } else {
          setIntrebariFinal([
            ...intrebariChimie,
            ...intrebariMatematica,
            ...intrebariRomana,
          ]);
        }
      } else {
        if (state[0].name == "Română") {
          if (state[1].name == "Matematică") {
            setIntrebariFinal([
              ...intrebariRomana,
              ...intrebariMatematica,
              ...intrebariChimie,
            ]);
          } else {
            setIntrebariFinal([
              ...intrebariRomana,
              ...intrebariChimie,
              ...intrebariMatematica,
            ]);
          }
        } else if (state[0].name == "Matematică") {
          if (state[1].name == "Română") {
            setIntrebariFinal([
              ...intrebariMatematica,
              ...intrebariRomana,
              ...intrebariChimie,
            ]);
          } else {
            setIntrebariFinal([
              ...intrebariMatematica,
              ...intrebariChimie,
              ...intrebariRomana,
            ]);
          }
        }
      }
    } else if (input == "fizica") {
      if (state[0].name == "Fizică") {
        if (state[1].name == "Română") {
          setIntrebariFinal([
            ...intrebariFizica,
            ...intrebariRomana,
            ...intrebariMatematica,
          ]);
        } else {
          setIntrebariFinal([
            ...intrebariFizica,
            ...intrebariMatematica,
            ...intrebariRomana,
          ]);
        }
      } else {
        if (state[0].name == "Română") {
          if (state[1].name == "Matematică") {
            setIntrebariFinal([
              ...intrebariRomana,
              ...intrebariMatematica,
              ...intrebariFizica,
            ]);
          } else {
            setIntrebariFinal([
              ...intrebariRomana,
              ...intrebariFizica,
              ...intrebariMatematica,
            ]);
          }
        } else if (state[0].name == "Matematică") {
          if (state[1].name == "Română") {
            setIntrebariFinal([
              ...intrebariMatematica,
              ...intrebariRomana,
              ...intrebariFizica,
            ]);
          } else {
            setIntrebariFinal([
              ...intrebariMatematica,
              ...intrebariFizica,
              ...intrebariRomana,
            ]);
          }
        }
      }
    } else if (input == "biologie") {
      if (state[0].name == "Biologie") {
        if (state[1].name == "Română") {
          setIntrebariFinal([
            ...intrebariBiologie,
            ...intrebariRomana,
            ...intrebariMatematica,
          ]);
        } else {
          setIntrebariFinal([
            ...intrebariBiologie,
            ...intrebariMatematica,
            ...intrebariRomana,
          ]);
        }
      } else {
        if (state[0].name == "Română") {
          if (state[1].name == "Matematică") {
            setIntrebariFinal([
              ...intrebariRomana,
              ...intrebariMatematica,
              ...intrebariBiologie,
            ]);
          } else {
            setIntrebariFinal([
              ...intrebariRomana,
              ...intrebariBiologie,
              ...intrebariMatematica,
            ]);
          }
        } else if (state[0].name == "Matematică") {
          if (state[1].name == "Română") {
            setIntrebariFinal([
              ...intrebariMatematica,
              ...intrebariRomana,
              ...intrebariBiologie,
            ]);
          } else {
            setIntrebariFinal([
              ...intrebariMatematica,
              ...intrebariBiologie,
              ...intrebariRomana,
            ]);
          }
        }
      }
    }
  }

  const [colorButton1, setColorButton1] = useState("primary");
  const [colorButton2, setColorButton2] = useState("primary");
  const [colorButton3, setColorButton3] = useState("primary");
  const [colorButton4, setColorButton4] = useState("primary");

  const [disabledButton1, setDisabledButton1] = useState(false);
  const [disabledButton2, setDisabledButton2] = useState(false);
  const [disabledButton3, setDisabledButton3] = useState(false);
  const [disabledButton4, setDisabledButton4] = useState(false);

  const ColorSuccess = "green";
  const ColorError = "red";

  const [Gresite, setGresite] = useState({
    Matematica: {
      Numar: 0,
      Capitole: [],
      Intrebari: [],
      RaspunsuriCorecte: [],
      RaspunsuriGresite: [],
    },
    Romana: {
      Numar: 0,
      Capitole: [],
      Intrebari: [],
      RaspunsuriGresite: [],
      RaspunsuriCorecte: [],
    },
    Alt: {
      Numar: 0,
      Capitole: [],
      Intrebari: [],
      RaspunsuriGresite: [],
      RaspunsuriCorecte: [],
    },
  });

  function resetButtons() {
    setColorButton1("primary");
    setColorButton2("primary");
    setColorButton3("primary");
    setColorButton4("primary");
    setDisabledButton1(false);
    setDisabledButton2(false);
    setDisabledButton3(false);
    setDisabledButton4(false);
  }

  var tewsting = 0;

  function submit(input) {
    if (input == intrebariFinal[currIntrebare].raspunsCorect) {
      if (input == 1) {
        setColorButton1(ColorSuccess);
        setDisabledButton2(true);
        setDisabledButton3(true);
        setDisabledButton4(true);
      }
      if (input == 2) {
        setColorButton2(ColorSuccess);
        setDisabledButton1(true);
        setDisabledButton3(true);
        setDisabledButton4(true);
      }
      if (input == 3) {
        setColorButton3(ColorSuccess);
        setDisabledButton1(true);
        setDisabledButton2(true);
        setDisabledButton4(true);
      }
      if (input == 4) {
        setColorButton4(ColorSuccess);
        setDisabledButton1(true);
        setDisabledButton2(true);
        setDisabledButton3(true);
      }
    } else {
      if (intrebariFinal[currIntrebare].materie == "Romana") {
        setGresite((prevGresite) => ({
          ...prevGresite,
          Romana: {
            Numar: prevGresite.Romana.Numar + 1,
            Capitole: [
              ...prevGresite.Romana.Capitole,
              intrebariFinal[currIntrebare].capitol,
            ],
            Intrebari: [
              ...prevGresite.Romana.Intrebari,
              intrebariFinal[currIntrebare].intrebare,
            ],
            RaspunsuriCorecte: [
              ...prevGresite.Romana.RaspunsuriCorecte,
              intrebariFinal[currIntrebare].raspunsuri[
                intrebariFinal[currIntrebare].raspunsCorect - 1
              ],
            ],
            RaspunsuriGresite: [
              ...prevGresite.Romana.RaspunsuriGresite,
              intrebariFinal[currIntrebare].raspunsuri[input - 1],
            ],
          },
        }));
      } else if (intrebariFinal[currIntrebare].materie == "Matematica") {
        setGresite((prevGresite) => ({
          ...prevGresite,
          Matematica: {
            Numar: prevGresite.Matematica.Numar + 1,
            Capitole: [
              ...prevGresite.Matematica.Capitole,
              intrebariFinal[currIntrebare].capitol,
            ],
            Intrebari: [
              ...prevGresite.Matematica.Intrebari,
              intrebariFinal[currIntrebare].intrebare,
            ],
            RaspunsuriCorecte: [
              ...prevGresite.Matematica.RaspunsuriCorecte,
              intrebariFinal[currIntrebare].raspunsuri[
                intrebariFinal[currIntrebare].raspunsCorect - 1
              ],
            ],
            RaspunsuriGresite: [
              ...prevGresite.Matematica.RaspunsuriGresite,
              intrebariFinal[currIntrebare].raspunsuri[input - 1],
            ],
          },
        }));
      } else if (
        intrebariFinal[currIntrebare].materie == "Informatica" ||
        intrebariFinal[currIntrebare].materie == "Chimie" ||
        intrebariFinal[currIntrebare].materie == "Biologie" ||
        intrebariFinal[currIntrebare].materie == "Fizica"
      ) {
        setGresite((prevGresite) => ({
          ...prevGresite,
          Alt: {
            Numar: prevGresite.Alt.Numar + 1,
            Capitole: [
              ...prevGresite.Alt.Capitole,
              intrebariFinal[currIntrebare].capitol,
            ],
            Intrebari: [
              ...prevGresite.Alt.Intrebari,
              intrebariFinal[currIntrebare].intrebare,
            ],
            RaspunsuriCorecte: [
              ...prevGresite.Alt.RaspunsuriCorecte,
              intrebariFinal[currIntrebare].raspunsuri[
                intrebariFinal[currIntrebare].raspunsCorect - 1
              ],
            ],
            RaspunsuriGresite: [
              ...prevGresite.Alt.RaspunsuriGresite,
              intrebariFinal[currIntrebare].raspunsuri[input - 1],
            ],
          },
        }));
      }
      if (input == 1) {
        setColorButton1(ColorError);
      }
      if (input == 2) {
        setColorButton2(ColorError);
      }
      if (input == 3) {
        setColorButton3(ColorError);
      }
      if (input == 4) {
        setColorButton4(ColorError);
      }
      if (intrebariFinal[currIntrebare].raspunsCorect == 1) {
        setColorButton1(ColorSuccess);
      }
      if (intrebariFinal[currIntrebare].raspunsCorect == 2) {
        setColorButton2(ColorSuccess);
      }
      if (intrebariFinal[currIntrebare].raspunsCorect == 3) {
        setColorButton3(ColorSuccess);
      }
      if (intrebariFinal[currIntrebare].raspunsCorect == 4) {
        setColorButton4(ColorSuccess);
      }
    }

    sleep(1500).then(() => {
      resetButtons();
      var numarIntrebari = 0;
      if (materie3 == "informatica") {
        numarIntrebari += intrebariInformatica.length;
      } else if (materie3 == "biologie") {
        numarIntrebari += intrebariBiologie.length;
      } else if (materie3 == "chimie") {
        numarIntrebari += intrebariChimie.length;
      } else if (materie3 == "fizica") {
        numarIntrebari += intrebariFizica.length;
      }
      numarIntrebari += intrebariRomana.length + intrebariMatematica.length;
      if (currIntrebare < numarIntrebari - 1) {
        setCurrIntrebare((prev) => prev + 1);
      } else {
        setPas((prev) => prev + 1);
      }
      console.log("CURRINTREBARE: ", currIntrebare);
      console.log("NUMARINTREBARI: ", numarIntrebari);
    });
  }

  const data = [
    { value: "luni", label: "Luni" },
    { value: "marti", label: "Marți" },
    { value: "miercuri", label: "Miercuri" },
    { value: "joi", label: "Joi" },
    { value: "vineri", label: "Vineri" },
    { value: "sambata", label: "Sâmbătă" },
    { value: "duminica", label: "Duminică" },
  ];

  const [value, setValue] = useState(
    [Date | null, Date | null] > [new Date(2021, 11, 1), new Date(2021, 11, 5)]
  );

  const [windowDimension, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimension]);

  var contents = [
    <DateRangePicker
      label="Selectează perioada de învățare"
      placeholder="Alege intervalul de date"
      value={value}
      onChange={setValue}
      mt="1rem"
      variant="filled"
      icon={<Calendar size={16} />}
    />,
    <MultiSelect
      value={days}
      onChange={setDays}
      data={data}
      transitionDuration={500}
      transition="fade"
      transitionTimingFunction="ease"
      label="Alege zilele in care vrei sa inveti"
      placeholder="Zi"
      variant="filled"
    />,
    <TimeRangeInput
      icon={<Clock size={16} />}
      label="Alege orele de învățare"
      value={date}
      onChange={setDate}
      clearable
      variant="filled"
    />,
    <>
      <Text weight="600" size="sm">
        La ce materii doresti sa te pregatesti?
      </Text>
      <Stack align="center" spacing="0px">
        <Button
          className={classes.top}
          style={{ width: "8rem" }}
          variant="light"
          disabled
        >
          Romana
        </Button>
        <Button
          className={classes.middle}
          style={{ width: "8rem" }}
          variant="light"
          disabled
        >
          Matematica
        </Button>
        <Button
          className={classes.middle}
          variant={Form.Buttons.informatica.variant}
          style={{ width: "8rem" }}
          id="informatica"
          disabled={Form.Buttons.informatica.disabled}
          onClick={() => ToggleFormButton("informatica")}
        >
          Informatica
        </Button>
        <Button
          className={classes.middle}
          style={{ width: "8rem" }}
          variant={Form.Buttons.chimie.variant}
          id="chimie"
          disabled={Form.Buttons.chimie.disabled}
          onClick={() => ToggleFormButton("chimie")}
        >
          Chimie
        </Button>
        <Button
          className={classes.middle}
          style={{ width: "8rem" }}
          variant={Form.Buttons.biologie.variant}
          id="biologie"
          disabled={Form.Buttons.biologie.disabled}
          onClick={() => ToggleFormButton("biologie")}
        >
          Biologie
        </Button>
        <Button
          className={classes.bottom}
          style={{ width: "8rem" }}
          variant={Form.Buttons.fizica.variant}
          id="fizica"
          disabled={Form.Buttons.fizica.disabled}
          onClick={() => ToggleFormButton("fizica")}
        >
          Fizica
        </Button>
      </Stack>
    </>,
    <>
      <Text weight="600" size="sm">
        Ordonează materiile după prioritate
      </Text>
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          handlers.reorder({ from: source.index, to: destination.index })
        }
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {ditems}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>,
    <>
      <Title order={3}>Atenție</Title>
      <Text>
        Următorul pas este testul. După ce vei apăsa butonul de mai jos, nu te
        vei mai putea intoarce fără a pierde progresul. Apasă când ești
        pregătit.
      </Text>
    </>,
    <>
      <Title order={3}>{intrebariFinal[currIntrebare].materie}</Title>
      <Text color="dimmed">{intrebariFinal[currIntrebare].capitol}</Text>
      <Paper shadow="xl" p="md" withBorder>
        {intrebariFinal[currIntrebare].intrebare}
      </Paper>
      {console.log(state)}
      <Center>
        <Stack spacing="0.3rem" mt="xs">
          <Button
            color={colorButton1}
            disabled={disabledButton1}
            onClick={() => submit(1)}
            variant="light"
          >
            {intrebariFinal[currIntrebare].raspunsuri[0]}
          </Button>
          <Button
            color={colorButton2}
            disabled={disabledButton2}
            onClick={() => submit(2)}
            variant="light"
          >
            {intrebariFinal[currIntrebare].raspunsuri[1]}
          </Button>
          <Button
            color={colorButton3}
            disabled={disabledButton3}
            onClick={() => submit(3)}
            variant="light"
          >
            {intrebariFinal[currIntrebare].raspunsuri[2]}
          </Button>
          <Button
            color={colorButton4}
            disabled={disabledButton4}
            onClick={() => submit(4)}
            variant="light"
          >
            {intrebariFinal[currIntrebare].raspunsuri[3]}
          </Button>
        </Stack>
      </Center>
    </>,
    <>
      <Title>Felicitari!</Title>
      <Text>
        Ai terminat primele <b>2</b> etape din generarea orarului, iar de a
        treia ne vom ocupa noi.
      </Text>
    </>,
  ];

  return (
    <div className="Home">
      <div
        style={{
          background: dark
            ? "url(" + backgroundDark + ")"
            : "url(" + backgroundLight + ")",
          height: "120vh",
          paddingTop: "10vh",
        }}
      >
        <Container>
          <div className={classes.inner}>
            <div className={classes.content}>
              <Title className={classes.title}>
                Edu
                <span className={classes.highlight}>Vision</span> <br />{" "}
              </Title>
              <Text color="dimmed" mt="md">
                Generează orare de învățare pentru elevi în 3 pași simpli
              </Text>
              <List
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="primary" size={24} radius="xl">
                    <Check size={16} />
                  </ThemeIcon>
                }
                style={{
                  alignContent: "left",
                  alignItems: "left",
                  textAlign: "left",
                  paddingTop: "2rem",
                }}
              >
                <List.Item>
                  <b>Relevanță</b> - orare care pun accent pe dificultățile
                  elevului
                </List.Item>
                <List.Item>
                  <b>Testat</b> - orare testate chiar de către elevi
                </List.Item>
                <List.Item>
                  <b>Personalizat</b> - orare personalizate pentru elevi
                </List.Item>
                <List.Item>
                  <b>Rapid</b> - orare care sunt generate în mod rapid
                </List.Item>
                <List.Item>
                  <b>Securizat</b> - orare care sunt generate în mod securizat
                </List.Item>
              </List>
              <Group mt={30}>
                {loggedin ? (
                  <Button
                    variant="light"
                    radius="xl"
                    size="md"
                    className={classes.control}
                    onClick={() => {
                      document
                        .getElementById("second")
                        .scrollIntoView({ behavior: "smooth" });
                      setPointsProvider(true);
                    }}
                  >
                    Get started
                  </Button>
                ) : (
                  <>
                    <Button
                      leftIcon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="24"
                          height="24"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                          ></path>
                          <path
                            fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                          ></path>
                          <path
                            fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                          ></path>
                          <path
                            fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                          ></path>
                        </svg>
                      }
                      onClick={() => {
                        SignInWithGoogle().then(function () {
                          setTimeout(history.push("/login"), 1000);
                        });
                      }}
                      variant="default"
                      radius="xl"
                      size="sm"
                    >
                      Sign in with Google
                    </Button>
                  </>
                )}

                <Button
                  variant="default"
                  radius="xl"
                  size="md"
                  className={classes.control}
                  onClick={() => {
                    if (!loggedin) {
                      setMountDouble(true);
                      scrollIntoView({ alignment: "center" });
                    } else {
                      navigate(
                        "https://github.com/EduVision2022/EduVision",
                        true
                      );
                    }
                  }}
                >
                  {loggedin ? "Source code" : "Learn more"}
                </Button>
              </Group>
            </div>
            <Image src={image} className={classes.image} />
          </div>
        </Container>
        <Container style={{ paddingTop: "80vh" }}>
          {windowDimension.winWidth > 768 ? (
            <SimpleGrid
              cols={3}
              style={{ alignContent: "center", alignItems: "center" }}
            >
              <div>
                <h3 className="text-center ">
                  <span className="text-white" style={{ fontSize: "5rem" }}>
                    <b>100</b>
                    <br />
                  </span>
                  <span className="text-white">orare generate</span>
                </h3>
              </div>
              <Divider
                size="xs"
                color={dark ? "grey" : "grey"}
                orientation="vertical"
                style={{
                  left: "50%",
                  transform: "translate(50%, 10%)",
                }}
              />
              <div style={{ paddingTop: "2.5rem" }}>
                <h2 className="text-5xl md:text-7xl leading-[1.05] mb-2 flex">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="2em"
                    width="2em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                  </svg>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    className="-ml-1"
                    height="2em"
                    width="2em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                  </svg>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    className="-ml-1"
                    height="2em"
                    width="2em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                  </svg>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    className="-ml-1"
                    height="2em"
                    width="2em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                  </svg>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    className="-mx-1"
                    height="2em"
                    width="2em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                  </svg>
                </h2>
                <h3 className="h3 mb-0">Votat de elevi</h3>
              </div>
            </SimpleGrid>
          ) : (
            <Stack>
              <div style={{ marginTop: "-1rem" }}>
                <h3 className="text-center">
                  <span className="text-white" style={{ fontSize: "3rem" }}>
                    <b>100</b>
                    <br />
                  </span>
                  <span className="text-white">orare generate</span>
                </h3>
              </div>
              <Divider
                size="xs"
                color={dark ? "grey" : "grey"}
                orientation="horizontal"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <div>
                <h2 className="text-5xl md:text-7xl leading-[1.05] mb-2 flex">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                  </svg>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    className="-ml-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                  </svg>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    className="-ml-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                  </svg>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    className="-ml-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                  </svg>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    className="-mx-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M463 192H315.9L271.2 58.6C269 52.1 262.9 48 256 48s-13 4.1-15.2 10.6L196.1 192H48c-8.8 0-16 7.2-16 16 0 .9.1 1.9.3 2.7.2 3.5 1.8 7.4 6.7 11.3l120.9 85.2-46.4 134.9c-2.3 6.5 0 13.8 5.5 18 2.9 2.1 5.6 3.9 9 3.9 3.3 0 7.2-1.7 10-3.6l118-84.1 118 84.1c2.8 2 6.7 3.6 10 3.6 3.4 0 6.1-1.7 8.9-3.9 5.6-4.2 7.8-11.4 5.5-18L352 307.2l119.9-86 2.9-2.5c2.6-2.8 5.2-6.6 5.2-10.7 0-8.8-8.2-16-17-16z"></path>
                  </svg>
                </h2>
                <h3 className="h3 mb-0">Votat de elevi</h3>
              </div>
            </Stack>
          )}
        </Container>
      </div>
      <div className="second" id="second" ref={targetRef}>
        {!loggedin ? (
          <Container>
            <Title order={3} style={{ paddingTop: "2rem" }}>
              HOW EDUVISION WORKS
            </Title>
            <Title order={2} style={{ paddingTop: "2rem" }}>
              Generează orare de învățare în 3 pași simpli
            </Title>
            <Timeline
              active={2}
              style={{
                paddingTop: "3rem",
                transform:
                  windowDimension.winWidth < 720
                    ? "translateX(0%)"
                    : "translateX(35%)",
              }}
            >
              <Timeline.Item title="Completează un formular">
                <Text color="dimmed" size="sm">
                  Obținem câteva informații despre timpul tău
                </Text>
              </Timeline.Item>
              <Timeline.Item title="Rezolvă un test">
                <Text color="dimmed" size="sm">
                  Determinăm nivelul tău de pregătire
                </Text>
              </Timeline.Item>
              <Timeline.Item title="Învață">
                <Text color="dimmed" size="sm">
                  Ne vom asigura să te evaluăm în timpul învățării
                </Text>
              </Timeline.Item>
            </Timeline>
          </Container>
        ) : (
          <>
            <Center style={{ paddingTop: "2rem" }}>
              <Paper radius="md" p="md" withBorder>
                <Stepper
                  active={active}
                  onStepClick={setActive}
                  breakpoint="sm"
                >
                  <Stepper.Step
                    label="Primul pas"
                    description="Creați un cont"
                  ></Stepper.Step>
                  <Stepper.Step
                    label="Pasul doi"
                    description="Completați un formular"
                  ></Stepper.Step>
                  <Stepper.Step
                    label="Pasul trei"
                    description="Rezolvă un test"
                  ></Stepper.Step>
                </Stepper>
              </Paper>
            </Center>
            <Center style={{ paddingTop: "2rem" }}>
              <Paper
                shadow="xl"
                p="md"
                radius="md"
                withBorder
                style={{ width: "22rem" }}
              >
                {contents[pas]}
                {showBack && pas != 6 && pas != 7 ? (
                  <Button
                    variant="light"
                    mt="1rem"
                    mr="sm"
                    color="red"
                    onClick={() => {
                      if (pas == 6) {
                        prevStep();
                      }
                      if (pas == 4) {
                        prevStep();
                      }
                      setPas(pas - 1);
                      setProgress(progress - 10);
                    }}
                  >
                    Back
                  </Button>
                ) : null}
                {pas != 6 ? (
                  <Button
                    onClick={() => {
                      if (pas == 7) {
                        history.push({
                          pathname: "/generator",
                          state: {
                            ore: state,
                            gresite: Gresite,
                            date: date,
                            days: days,
                            zile: value,
                          },
                        });
                      }
                      setProgress(progress + 10);
                      setPas(pas + 1);
                      console.log(value);
                      setShowBack(true);
                      console.log(days);
                      console.log(date);
                      if (pas == 4) {
                        setTrans(true);
                        SetMaterii(materie3);
                        nextStep();
                      }
                      if (pas == 5) {
                        console.log("GRESITE : ", Gresite);
                      }
                      if (pas == 5) {
                        nextStep();
                      }
                      console.log("PAS: ", pas);
                      console.log("MATERIE 1 : ", materie1);
                      console.log("MATERIE 2 : ", materie2);
                      console.log("MATERIE 3 : ", materie3);
                      console.log("INTREBARI: ", intrebariFinal);
                    }}
                    variant="light"
                    mt="1rem"
                  >
                    {pas == 5
                      ? "Start test"
                      : pas == 7
                      ? "Generează orarul"
                      : "Next"}
                  </Button>
                ) : null}
              </Paper>
            </Center>
          </>
        )}
      </div>
      {!loggedin ? (
        <div
          className="third"
          id="third"
          style={{
            background: dark
              ? "url(" + backgroundDarkInverted + ")"
              : "url(" + backgroundLightInverted + ")",
            height: "120vh",
            paddingTop: "0vh",
            marginTop: "3rem",
          }}
        >
          <FeaturesImages />
        </div>
      ) : null}
    </div>
  );
};
export default Home;
