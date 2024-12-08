import React, { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './Modal.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ModalLancamento({ isOpen, onClose, onSave, lancamentoEditando }) {
  const [lancamento, setLancamento] = useState({
    descricao: '',
    valor: '',
    categoria: '',
    tipo: 'saida',
    data: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (lancamentoEditando) {
      setLancamento({
        descricao: lancamentoEditando.descricao || '',
        valor: lancamentoEditando.valor || '',
        categoria: lancamentoEditando.categoria || '',
        tipo: lancamentoEditando.tipo || 'saida',
        data: lancamentoEditando.data?.split('T')[0] || new Date().toISOString().split('T')[0],
      });
    } else {
      setLancamento({
        descricao: '',
        valor: '',
        categoria: '',
        tipo: 'saida',
        data: new Date().toISOString().split('T')[0],
      });
    }
  }, [lancamentoEditando]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const valorNumerico = Number(lancamento.valor);
    if (isNaN(valorNumerico)) {
      alert('Por favor, insira um valor válido');
      return;
    }

    const lancamentoFormatado = {
      descricao: lancamento.descricao.trim(),
      valor: valorNumerico,
      categoria: lancamento.categoria,
      tipo: lancamento.tipo,
      data: new Date(lancamento.data).toISOString(),
    };

    onSave(lancamentoFormatado);
  };

  const handleValorChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setLancamento({ ...lancamento, valor: value });
    }
  };

  const categoriasDespesa = [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Outros'
  ];

  const categoriasEntrada = [
    'Salário',
    'Freelance',
    'Investimentos',
    'Outros'
  ];

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={isOpen}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {lancamentoEditando ? 'Editar Lançamento' : 'Novo Lançamento'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tipo:</label>
              <select
                value={lancamento.tipo}
                onChange={(e) => setLancamento({ ...lancamento, tipo: e.target.value, categoria: '' })}
                required
              >
                <option value="saida">Despesa</option>
                <option value="entrada">Entrada</option>
              </select>
            </div>

            <div className="form-group">
              <label>Descrição:</label>
              <input
                type="text"
                value={lancamento.descricao}
                onChange={(e) => setLancamento({ ...lancamento, descricao: e.target.value })}
                required
                placeholder="Digite a descrição"
              />
            </div>

            <div className="form-group">
              <label>Valor:</label>
              <input
                type="text"
                value={lancamento.valor}
                onChange={handleValorChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label>Categoria:</label>
              <select
                value={lancamento.categoria}
                onChange={(e) => setLancamento({ ...lancamento, categoria: e.target.value })}
                required
              >
                <option value="">Selecione uma categoria</option>
                {(lancamento.tipo === 'despesa' ? categoriasDespesa : categoriasEntrada).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Data:</label>
              <input
                type="date"
                value={lancamento.data}
                onChange={(e) => setLancamento({ ...lancamento, data: e.target.value })}
                required
              />
            </div>

            <div className="modal-buttons">
              <Button type="submit" className="btn-save">Salvar</Button>
              <Button type="button" onClick={onClose} className="btn-cancel">Cancelar</Button>
            </div>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
} 