import { useState, useEffect } from 'react';
import { ChakraProvider, Box, Button, Image, Flex, Grid, Input, Link, Text, extendTheme, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, List, ListItem } from '@chakra-ui/react';
import { FaBackspace, FaExchangeAlt, FaSync, FaInfoCircle, FaLinkedin, FaGithub, FaInstagram, FaEnvelope } from 'react-icons/fa';

import fetchCurrencyData from './services/currency'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.800',
        color: 'white',
      },
    },
  },
});

const moedas = [
  { "nome": "BRL", "descricao": "Real brasileiro", "path": "https://flagsapi.com/BR/flat/64.png" },
    { "nome": "USD", "descricao": "Dólar americano", "path": "https://flagsapi.com/US/flat/64.png" },
    { "nome": "EUR", "descricao": "Euro", "path": "https://flagsapi.com/CK/flat/64.png" },
    { "nome": "GBP", "descricao": "Libra Esterlina", "path": "https://flagsapi.com/GB/flat/64.png" },
    { "nome": "JPY", "descricao": "Iene Japonês", "path": "https://flagsapi.com/JP/flat/64.png" },
    { "nome": "CAD", "descricao": "Dólar Canadense", "path": "https://flagsapi.com/CA/flat/64.png" },
    { "nome": "AUD", "descricao": "Dólar Australiano", "path": "https://flagsapi.com/AU/flat/64.png" },
    { "nome": "CHF", "descricao": "Franco Suíço", "path": "https://flagsapi.com/CH/flat/64.png" },
    { "nome": "CNY", "descricao": "Yuan Chinês", "path": "https://flagsapi.com/CN/flat/64.png" },
    { "nome": "HKD", "descricao": "Dólar de Hong Kong", "path": "https://flagsapi.com/HK/flat/64.png" },
    { "nome": "INR", "descricao": "Rúpia Indiana", "path": "https://flagsapi.com/IN/flat/64.png" },
    { "nome": "KRW", "descricao": "Won Sul-Coreano", "path": "https://flagsapi.com/KR/flat/64.png" }
];

const buttons = [
  'C', 'backspace', 'exchange', '/', 
  '7', '8', '9', 'X', 
  '4', '5', '6', '-', 
  '1', '2', '3', '+', 
  '0', ',', '%', '='
];

const Calculator = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isContactModalOpen, setContactModalOpen] = useState(false);


  const [inputValue, setInputValue] = useState('');
  const [convertedValue, setConvertedValue] = useState('');

  const [selectedCurrency, setSelectedCurrency] = useState(moedas[2]);
  const [conversionCurrency, setConversionCurrency] = useState(moedas[1]);
  const [currentCurrencySelection, setCurrentCurrencySelection] = useState("selectedCurrency");

  const [conversionRate, setConversionRate] = useState(null);
  const [lastUpdateDate, setLastUpdateDate] = useState(null);

  const openContactModal = () => setContactModalOpen(true);
  const closeContactModal = () => setContactModalOpen(false);

  const handleClear = () => {
    setInputValue('');
  };

  const handleBackspace = () => {
    console.log('backspace')
    setInputValue((prevValue) => prevValue.slice(0, -1));
  };

  const handleExchange = () => {
    setSelectedCurrency(conversionCurrency);
    setConversionCurrency(selectedCurrency);
  };

  const handleNumberClick = (number) => {
    setInputValue((prevValue) => prevValue + number);
  };
  
  const updateConversionData = async () => {
    const data = await fetchCurrencyData(selectedCurrency.nome, conversionCurrency.nome);
    if (data) {
      setConversionRate(data.ask);
      setLastUpdateDate(data.date);
    }
  };

  useEffect(() => {
    updateConversionData()
  }, [selectedCurrency, conversionCurrency ])

  useEffect(() => {
    const calculatedValue = inputValue && conversionRate ? (parseFloat(inputValue) * parseFloat(conversionRate)).toFixed(2) : '';
    setConvertedValue(calculatedValue);
  }, [inputValue, conversionRate]);

  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" align="center" justify="center" h="100%">

        <Box w="100%" h="15%" bg="gray.700" display="flex" alignItems="center" justifyContent="space-between" p="4">
          <Flex cursor="pointer" onClick={() => { setCurrentCurrencySelection("selectedCurrency"); onOpen(); }}>
            <Image src={selectedCurrency.path} w="30px" h="30px" />
            <Box ml="2">{selectedCurrency.nome}</Box>
          </Flex>
          <Flex>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder=""
              bg="transparent"
              border="none"
              _focus={{ border: "none", boxShadow: "none" }}
              _placeholder={{ color: 'gray.300' }}
            />
          </Flex>
        </Box>

        <Box w="100%" h="15%" bg="gray.700" display="flex" alignItems="center" justifyContent="space-between" p="4">
          <Flex cursor="pointer" onClick={() => { setCurrentCurrencySelection("conversionCurrency"); onOpen(); }}>
            <Image src={conversionCurrency.path} w="30px" h="30px" />
            <Box ml="2">{conversionCurrency.nome}</Box>
          </Flex>
          <Flex>
            <Input
              value={convertedValue}
              readOnly
              bg="transparent"
              border="none"
              _focus={{ border: "none", boxShadow: "none" }}
              _placeholder={{ color: 'gray.300' }}
            />
          </Flex>
        </Box>

        <Flex w="100%" h="75%" bg="gray.700" p="4">
          <Grid templateRows="repeat(5, 1fr)" templateColumns="repeat(4, 1fr)" gap={4} w="100%" h="100%">
            {buttons.map((btn, index) => (
              <Button 
                key={index} 
                p="8" 
                onClick={() => {
                  if (btn === 'C') handleClear();
                  else if (btn === 'backspace') handleBackspace();
                  else if (btn === 'exchange') handleExchange();
                  else if (typeof btn === 'string' && !isNaN(btn)) handleNumberClick(btn);
                }}
                bg={['/', 'X', '-', '+', '='].includes(btn) ? "orange.400" : "gray.600"}
                color={['/', 'X', '-', '+', '='].includes(btn) ? "white" : "inherit"}
                borderRadius="md"
              >
                {btn === 'backspace' ? <FaBackspace /> : btn === 'exchange' ? <FaExchangeAlt /> : btn}
              </Button>
            ))}
          </Grid>
        </Flex>

        <Flex w="100%" h="10%" bg="gray.700" justify="space-between" align="center" p="4">
          <Button
            bg={"transparent"}
            color={"white"}
            onClick={() => updateConversionData()}
            cursor="pointer">
            <FaSync/>
          </Button>

          <Box>
            {lastUpdateDate && new Date(lastUpdateDate).toLocaleString()}<br />
            1 {selectedCurrency.nome} = {conversionRate} {conversionCurrency.nome}
          </Box>
          <Button
            bg={"transparent"}
            color={"white"}
            onClick={openContactModal}
            cursor="pointer">
          <FaInfoCircle/>
          </Button>
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg="gray.700">
            <ModalHeader color="white">Escolha uma Moeda</ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody>
              <List spacing={3}>
                {moedas.map((moeda) => (
                  <ListItem
                    key={moeda.nome}
                    cursor="pointer"
                    color="gray.300"
                    _hover={{ bg: "gray.600", color: "white" }}
                    onClick={() => {
                      if (currentCurrencySelection === "selectedCurrency") {
                        setSelectedCurrency(moeda);
                      } else {
                        setConversionCurrency(moeda);
                      }
                      onClose();
                    }}
                  >
                    <Flex>
                      <Image src={moeda.path} w="30px" h="30px" />
                      <Box ml="2">{moeda.descricao}</Box>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            </ModalBody>
          </ModalContent>
        </Modal>
        <Modal isOpen={isContactModalOpen} onClose={closeContactModal}>
          <ModalOverlay />
          <ModalContent bg="gray.700">
            <ModalHeader color="white">Contato</ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody>
              <Flex direction="column" align="center" justify="center">
                <Link href="https://www.linkedin.com/in/thiago-vasconcellos-anuszkiewicz-ba070442/" isExternal color="blue.500">
                  <Flex align="center">
                    <FaLinkedin />
                    <Text ml="2">LinkedIn</Text>
                  </Flex>
                </Link>
                <Link href="https://github.com/thiagovasconcellos" isExternal color="gray.300">
                  <Flex align="center">
                    <FaGithub />
                    <Text ml="2">GitHub</Text>
                  </Flex>
                </Link>
                <Link href="https://www.instagram.com/thiagov.23/" isExternal color="pink.400">
                  <Flex align="center">
                    <FaInstagram />
                    <Text ml="2">Instagram</Text>
                  </Flex>
                </Link>
                <Link href="mailto:thiago.anuszkiewicz@gmail.com" isExternal color="red.500">
                  <Flex align="center">
                    <FaEnvelope />
                    <Text ml="2">E-mail</Text>
                  </Flex>
                </Link>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </ChakraProvider>
  );
};

export default Calculator;
