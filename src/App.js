import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

const useStyles = makeStyles({
  containerRoot: {
    display: 'flex',
    height: '100vh',
    marginTop: '36px'
  },
  container: {
    maxWidth: 800,
    margin: '0 auto'
  },
  table: {
    '& td': {
      textAlign: 'center',
      fontSize: 16
    }
  },
  resultContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '500px',
    padding: '12px',
    backgroundColor: '#f7f7f7',
    marginTop: '16px',
    borderRadius: '4px'
  },
  error: {
    marginBottom: '16px'
  },
  resutsTotal: {
    border: '1px solid',
    borderRadius: '8px',
    height: '40px',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    padding: '5px'
  }
});

const API_BASE_URL = 'http://localhost:8080';

function App() {
  const classes = useStyles();

  const [investmentAmount, setInvestmentAmount] = useState('5000');
  const [annualContribution, setAnnualContribution] = useState('3000');
  const [annualContributionIncrease, setAnnualContributionIncrease] = useState('1');
  const [investmentYears, setInvestmentYears] = useState('5');
  const [investmentReturn, setInvestmentReturn] = useState('21');

  const [tableData, setTableData] = useState([]);
  const [resultSummary, setResultSummary] = useState({});
  const [error, setError] = useState(null);

  const handleCalculate = () => {
    let body= {
      investmentAmount: investmentAmount,
      annualContribution: annualContribution,
      annualContributionIncrease: annualContributionIncrease,
      investmentYears: investmentYears,
      investmentReturn: investmentReturn
    }

    let headers = {
      'Content-Type': 'application/json'
    };
    axios.post(API_BASE_URL + '/api/investment', body, headers)
    .then(response => {
      const data = response.data
      // set state for table data
      setTableData(data.investmentResults);
      // set state for result summary
      setResultSummary(data.investmentSummary);
    }).catch(function (error) {
      setError('No es posible procesar su solicitud con los datos proporcionados.')
    });;
}

const handleReset = () => {
  setInvestmentAmount('');
  setAnnualContribution('');
  setAnnualContributionIncrease('');
  setInvestmentYears('');
  setInvestmentReturn('');
  setTableData([]);
  setResultSummary({});
  setError(null);
}

return (
  <div className={classes.containerRoot}>
    <div className={classes.container}>
    {error && <Alert onClick={() => {setError('')}} severity="error" className={classes.error}>{error}</Alert>}
      <div style={{display:'flex', gap: '10px'}}>
        <TextField label="Investment Amount" value={investmentAmount} onChange={e => setInvestmentAmount(e.target.value)} />
        <TextField label="Annual Contribution" value={annualContribution} onChange={e => setAnnualContribution(e.target.value)} />
        <TextField label="Annual Increase" value={annualContributionIncrease} onChange={e => setAnnualContributionIncrease(e.target.value)} />
        <TextField label="Investment Years" value={investmentYears} onChange={e => setInvestmentYears(e.target.value)} />
        <TextField label="Investment Return" value={investmentReturn} onChange={e => setInvestmentReturn(e.target.value)} />
      </div>
      <div style={{display:'flex', justifyContent: 'center', marginTop: '16px', gap:'15px'}}>
        <Button variant="contained" style={{marginTop: '16px'}} color="primary" onClick={handleCalculate}>Calcular</Button>
        <Button variant="contained" color="secondary" style={{marginTop: '16px'}} onClick={handleReset}>Limpiar</Button>
      </div>
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align='center'>Year</TableCell>
              <TableCell align='center'>Initial Balance</TableCell>
              <TableCell align='center'>Contribution</TableCell>
              <TableCell align='center'>Return</TableCell>
              <TableCell align='center'>Final Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.year}</TableCell>
                <TableCell>{row.initialBalance}</TableCell>
                <TableCell>{row.contribution}</TableCell>
                <TableCell>{row.return}</TableCell>
                <TableCell>{row.finalBalance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{display:'flex', flexDirection: 'row', justifyContent: 'space-between', width: '500px', marginTop: '16px'}}>
        <div className={classes.resutsTotal}>Monto Final: <b>{resultSummary.finalAmount}</b></div>
        <div className={classes.resutsTotal}>Ganancia por Inversión: <b>{resultSummary.investmentProfit}</b></div>
      </div>
    </div>
  </div>
);
}

export default App;