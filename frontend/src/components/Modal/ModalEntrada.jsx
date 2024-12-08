import * as React from 'react';
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

function ModalEntrada({ isOpen, onClose, onSave }) {
    const [entrada, setEntrada] = React.useState({
        descricao: '',
        valor: '',
        categoria: '',
        data: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const valorNumerico = Number(entrada.valor);
        if (isNaN(valorNumerico)) {
            alert('Por favor, insira um valor válido');
            return;
        }

        const entradaFormatada = {
            descricao: entrada.descricao.trim(),
            valor: valorNumerico,
            categoria: entrada.categoria,
            data: new Date(entrada.data).toISOString(),
        };

        onSave(entradaFormatada);
        
        setEntrada({
            descricao: '',
            valor: '',
            categoria: '',
            data: new Date().toISOString().split('T')[0],
        });
        onClose(); // Fecha o modal após salvar
    };

    const handleValorChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setEntrada({ ...entrada, valor: value });
        }
    };

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={isOpen}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={isOpen}>
                <Box sx={style}>
                    <Typography id="transition-modal-title" variant="h6" component="h2">
                        Nova Entrada
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Descrição:</label>
                            <input
                                type="text"
                                value={entrada.descricao}
                                onChange={(e) => setEntrada({ ...entrada, descricao: e.target.value })}
                                required
                                placeholder="Digite a descrição"
                            />
                        </div>
                        <div className="form-group">
                            <label>Valor:</label>
                            <input
                                type="text"
                                value={entrada.valor}
                                onChange={handleValorChange}
                                placeholder="0.00"
                                required
                                pattern="\d*\.?\d{0,2}"
                                title="Digite um valor numérico válido com até 2 casas decimais"
                            />
                        </div>
                        <div className="form-group">
                            <label>Categoria:</label>
                            <select
                                value={entrada.categoria}
                                onChange={(e) => setEntrada({ ...entrada, categoria: e.target.value })}
                                required
                            >
                                <option value="">Selecione uma categoria</option>
                                <option value="Salário">Salário</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Investimentos">Investimentos</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Data:</label>
                            <input
                                type="date"
                                value={entrada.data}
                                onChange={(e) => setEntrada({ ...entrada, data: e.target.value })}
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

export default ModalEntrada;