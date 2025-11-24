import { Button, createTheme } from "@mantine/core";

const warungTheme = createTheme({
  colors: {
    brown: [
      "#E5C9B8",
      "#C9A89A",
      "#B68B7D",
      "#A06E61",
      "#7D5B4E",
      "#5B3A35",
      "#4D302C",
      "#3F2523",
      "#312020",
      "#231C1C",
    ],
  },
  primaryColor: "brown",
  primaryShade: 5,
  components: {
    AppShell: {
      styles: {
        main: {
          background: "#4C2E01",
          color: "white",
        },
        header: {
          backgroundColor: "#8C6234",
          color: "white",
        },
      },
    },
    Paper: {
      styles: {
        root: {
          backgroundColor: "#8C6234",
          border: "1px solid gray",
          color: "white",
        },
      },
    },
    TextInput: {
      styles: {
        input: {
          background: "rgba(255,255,255,0.03)",
          color: "white",
          borderColor: "white",
        },
        label: {
          color: "white",
        },
      },
    },
    NumberInput: {
      styles: {
        input: {
          background: "rgba(255,255,255,0.03)",
          color: "white",
          borderColor: "white",
        },
        label: {
          color: "white",
        },
      },
    },
    Select: {
      styles: {
        input: {
          background: "rgba(255,255,255,0.03)",
          color: "white",
          borderColor: "white",
        },
        label: {
          color: "white",
        },
      },
    },
  },
});

export default warungTheme;
