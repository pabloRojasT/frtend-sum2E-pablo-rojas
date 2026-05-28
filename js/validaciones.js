const medicosPorEspecialidad = {
    clinica: ['Dr. Gomez, Carlos', 'Dra. Lopez, Maria'],
    cardiologia: ['Dr. Perez, Juan', 'Dra. Torres, Ana'],
    pediatria: ['Dra. Diaz, Laura', 'Dr. Soto, Pablo'],
    ginecologia: ['Dra. Romero, Valeria', 'Dra. Castro, Elena'],
    traumatologia: ['Dr. Ramos, Sergio', 'Dr. Herrera, Diego'],
    neurologia: ['Dr. Molina, Andres', 'Dra. Vargas, Cecilia']
};

function createMessageElement(field) {
    const formGroup = field.closest('.form-group');
    let message = formGroup.querySelector('.mensaje-error');
    if (!message) {
        message = document.createElement('span');
        message.className = 'mensaje-error';
        formGroup.appendChild(message);
    }
    return message;
}

function clearFieldState(field) {
    field.classList.remove('campo-error', 'campo-ok');
    const formGroup = field.closest('.form-group');
    const message = formGroup.querySelector('.mensaje-error');
    if (message) {
        message.textContent = '';
    }
}

function setFieldError(field, text) {
    field.classList.remove('campo-ok');
    field.classList.add('campo-error');
    const message = createMessageElement(field);
    message.textContent = text;
}

function setFieldOk(field) {
    field.classList.remove('campo-error');
    field.classList.add('campo-ok');
    const formGroup = field.closest('.form-group');
    const message = formGroup.querySelector('.mensaje-error');
    if (message) {
        message.textContent = '';
    }
}

function validateName(field) {
    const value = field.value.trim();
    const regex = /^[a-zA-Z\u00E1\u00E9\u00ED\u00F3\u00FA\u00C1\u00C9\u00CD\u00D3\u00DA\u00FC\u00DC\u00F1\u00D1\s]+$/;
    if (!value) {
        setFieldError(field, 'Este campo es obligatorio.');
        return false;
    }
    if (!regex.test(value)) {
        setFieldError(field, 'Solo se admiten letras y espacios.');
        return false;
    }
    setFieldOk(field);
    return true;
}

function validateDNI(field) {
    const value = field.value.trim();
    const regex = /^\d{7,8}$/;
    if (!value) {
        setFieldError(field, 'Debe ingresar el DNI.');
        return false;
    }
    if (!regex.test(value)) {
        setFieldError(field, 'El DNI debe tener 7 u 8 dígitos.');
        return false;
    }
    setFieldOk(field);
    return true;
}

function validateEmail(field) {
    const value = field.value.trim();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value) {
        setFieldError(field, 'El email es obligatorio.');
        return false;
    }
    if (!regex.test(value)) {
        setFieldError(field, 'Ingrese un correo válido.');
        return false;
    }
    setFieldOk(field);
    return true;
}

function validateTelefono(field) {
    const value = field.value.trim();
    const digits = value.replace(/[^0-9]/g, '');
    const regex = /^[0-9+\-\s]+$/;
    if (!value) {
        setFieldError(field, 'El teléfono es obligatorio.');
        return false;
    }
    if (!regex.test(value) || digits.length < 8) {
        setFieldError(field, 'Ingrese un teléfono válido con al menos 8 dígitos.');
        return false;
    }
    setFieldOk(field);
    return true;
}

function validateFechaNacimiento(field) {
    const value = field.value;
    if (!value) {
        setFieldError(field, 'La fecha de nacimiento es obligatoria.');
        return false;
    }
    const fecha = new Date(value + 'T00:00');
    const hoy = new Date();
    if (fecha > hoy) {
        setFieldError(field, 'La fecha no puede ser futura.');
        return false;
    }
    const edad = hoy.getFullYear() - fecha.getFullYear() - (hoy.getMonth() < fecha.getMonth() || (hoy.getMonth() === fecha.getMonth() && hoy.getDate() < fecha.getDate()) ? 1 : 0);
    if (edad < 0 || edad > 120) {
        setFieldError(field, 'La edad debe estar entre 0 y 120 años.');
        return false;
    }
    setFieldOk(field);
    return true;
}

function validateSelect(field, message) {
    if (!field.value) {
        setFieldError(field, message);
        return false;
    }
    setFieldOk(field);
    return true;
}

function validateMedico(field, especialidadValue) {
    if (!especialidadValue) {
        clearFieldState(field);
        return true;
    }
    if (!field.value) {
        setFieldError(field, 'Seleccione un médico.');
        return false;
    }
    setFieldOk(field);
    return true;
}

function parseDate(value) {
    return value ? new Date(value + 'T00:00:00') : null;
}

function parseTime(value) {
    if (!value) return null;
    const [hour, minute] = value.split(':').map(Number);
    return { hour, minute };
}

function validateFechaTurno(fechaField, horaField) {
    const fechaValue = fechaField.value;
    const horaValue = horaField.value;
    if (!fechaValue) {
        setFieldError(fechaField, 'La fecha del turno es obligatoria.');
        return false;
    }
    const fecha = parseDate(fechaValue);
    const dia = fecha.getDay();
    if (dia === 0 || dia === 6) {
        setFieldError(fechaField, 'El turno debe ser en un día de semana.');
        return false;
    }
    if (!horaValue) {
        setFieldOk(fechaField);
        return false;
    }
    const time = parseTime(horaValue);
    const fechaTurno = new Date(fecha);
    fechaTurno.setHours(time.hour, time.minute, 0, 0);
    const limite = new Date(Date.now() + 24 * 60 * 60 * 1000);
    if (fechaTurno < limite) {
        setFieldError(fechaField, 'El turno debe solicitarse con al menos 24 horas de antelación.');
        return false;
    }
    setFieldOk(fechaField);
    return true;
}

function validateHoraTurno(field) {
    const value = field.value;
    if (!value) {
        setFieldError(field, 'La hora del turno es obligatoria.');
        return false;
    }
    const time = parseTime(value);
    if (time.hour < 8 || time.hour > 20 || (time.hour === 20 && time.minute > 0)) {
        setFieldError(field, 'La hora debe estar entre 08:00 y 20:00.');
        return false;
    }
    setFieldOk(field);
    return true;
}

function validateCredencial(field, coverage) {
    if (!coverage || coverage === 'particular') {
        clearFieldState(field);
        return true;
    }
    const value = field.value.trim();
    if (!value) {
        setFieldError(field, 'El n�mero de credencial es obligatorio.');
        return false;
    }
    if (value.length < 5) {
        setFieldError(field, 'Debe tener al menos 5 caracteres.');
        return false;
    }
    setFieldOk(field);
    return true;
}

function validatePlan(field, coverage) {
    if (!coverage || coverage === 'particular') {
        clearFieldState(field);
        return true;
    }
    const value = field.value.trim();
    if (!value) {
        setFieldError(field, 'El plan es obligatorio.');
        return false;
    }
    setFieldOk(field);
    return true;
}

function validateComoNosConocio(field, isFirstVisit) {
    if (!isFirstVisit) {
        clearFieldState(field);
        return true;
    }
    if (!field.value) {
        setFieldError(field, 'Seleccione cómo nos conoció.');
        return false;
    }
    setFieldOk(field);
    return true;
}

function validateMotivo(field) {
    const value = field.value.trim();
    if (!value) {
        setFieldError(field, 'El motivo de consulta es obligatorio.');
        return false;
    }
    if (value.length < 20) {
        setFieldError(field, 'Debe contener al menos 20 caracteres.');
        return false;
    }
    setFieldOk(field);
    return true;
}

function validateDescripcionEstudios(field, hasStudies) {
    if (!hasStudies) {
        clearFieldState(field);
        return true;
    }
    const value = field.value.trim();
    if (!value) {
        setFieldError(field, 'La descripción de estudios es obligatoria.');
        return false;
    }
    if (value.length < 20) {
        setFieldError(field, 'Debe contener al menos 20 caracteres.');
        return false;
    }
    setFieldOk(field);
    return true;
}

function updateMedicoOptions() {
    const especialidadSelect = document.getElementById('especialidad');
    const medicoSelect = document.getElementById('medico');
    const selectedEspecialidad = especialidadSelect.value;
    medicoSelect.innerHTML = '';

    if (!selectedEspecialidad || !medicosPorEspecialidad[selectedEspecialidad]) {
        medicoSelect.disabled = true;
        medicoSelect.innerHTML = '<option value="">Selecciona una especialidad primero</option>';
        return;
    }

    medicoSelect.disabled = false;
    medicoSelect.innerHTML = '<option value="">Selecciona un médico</option>';
    medicosPorEspecialidad[selectedEspecialidad].forEach((medico) => {
        const option = document.createElement('option');
        option.value = medico;
        option.textContent = medico;
        medicoSelect.appendChild(option);
    });
}

function updateModalidad() {
    const modalidadSelect = document.getElementById('modalidad');
    const plataformaGroup = document.getElementById('plataforma-group');
    const plataformaSelect = document.getElementById('plataforma');
    if (modalidadSelect.value === 'videoconsulta') {
        plataformaGroup.style.display = 'block';
        plataformaSelect.setAttribute('required', 'required');
    } else {
        plataformaGroup.style.display = 'none';
        plataformaSelect.removeAttribute('required');
        plataformaSelect.value = '';
        clearFieldState(plataformaSelect);
    }
}

function updateCobertura() {
    const coberturaSelect = document.getElementById('cobertura');
    const credencialGroup = document.getElementById('credencial-group');
    const planGroup = document.getElementById('plan-group');
    const numeroCredencial = document.getElementById('numero-credencial');
    const planInput = document.getElementById('plan');

    if (coberturaSelect.value && coberturaSelect.value !== 'particular') {
        credencialGroup.style.display = 'block';
        planGroup.style.display = 'block';
        numeroCredencial.setAttribute('required', 'required');
        planInput.setAttribute('required', 'required');
    } else {
        credencialGroup.style.display = 'none';
        planGroup.style.display = 'none';
        numeroCredencial.removeAttribute('required');
        planInput.removeAttribute('required');
        numeroCredencial.value = '';
        planInput.value = '';
        clearFieldState(numeroCredencial);
        clearFieldState(planInput);
    }
}

function updatePrimeraVisita() {
    const primeraVisitaCheckbox = document.getElementById('primera-visita');
    const conocioGroup = document.getElementById('conocio-group');
    const conocioSelect = document.getElementById('como-nos-conocio');
    if (primeraVisitaCheckbox.checked) {
        conocioGroup.style.display = 'block';
        conocioSelect.setAttribute('required', 'required');
    } else {
        conocioGroup.style.display = 'none';
        conocioSelect.removeAttribute('required');
        conocioSelect.value = '';
        clearFieldState(conocioSelect);
    }
}

function updateEstudiosPrevios() {
    const estudiosPreviosCheckbox = document.getElementById('estudios-previos');
    const descripcionEstudiosGroup = document.getElementById('descripcion-estudios-group');
    const descripcionEstudios = document.getElementById('descripcion-estudios');
    if (estudiosPreviosCheckbox.checked) {
        descripcionEstudiosGroup.style.display = 'block';
        descripcionEstudios.setAttribute('required', 'required');
    } else {
        descripcionEstudiosGroup.style.display = 'none';
        descripcionEstudios.removeAttribute('required');
        descripcionEstudios.value = '';
        clearFieldState(descripcionEstudios);
    }
}

function validateField(field) {
    switch (field.id) {
        case 'nombre':
        case 'apellido':
            return validateName(field);
        case 'dni':
            return validateDNI(field);
        case 'email':
            return validateEmail(field);
        case 'telefono':
            return validateTelefono(field);
        case 'fecha-nacimiento':
            return validateFechaNacimiento(field);
        case 'especialidad':
            return validateSelect(field, 'Seleccione una especialidad.');
        case 'medico':
            return validateMedico(field, document.getElementById('especialidad').value);
        case 'tipo-consulta':
            return validateSelect(field, 'Seleccione tipo de consulta.');
        case 'fecha-turno':
            return validateFechaTurno(field, document.getElementById('hora-turno'));
        case 'hora-turno':
            const success = validateHoraTurno(field);
            if (success && document.getElementById('fecha-turno').value) {
                validateFechaTurno(document.getElementById('fecha-turno'), field);
            }
            return success;
        case 'modalidad':
            return validateSelect(field, 'Seleccione una modalidad.');
        case 'plataforma':
            if (document.getElementById('modalidad').value === 'videoconsulta') {
                return validateSelect(field, 'Seleccione una plataforma.');
            }
            clearFieldState(field);
            return true;
        case 'cobertura':
            return validateSelect(field, 'Seleccione una cobertura.');
        case 'numero-credencial':
            return validateCredencial(field, document.getElementById('cobertura').value);
        case 'plan':
            return validatePlan(field, document.getElementById('cobertura').value);
        case 'como-nos-conocio':
            return validateComoNosConocio(field, document.getElementById('primera-visita').checked);
        case 'motivo-consulta':
            return validateMotivo(field);
        case 'descripcion-estudios':
            return validateDescripcionEstudios(field, document.getElementById('estudios-previos').checked);
        default:
            return true;
    }
}

function attachValidationListeners() {
    const fields = [
        'nombre', 'apellido', 'dni', 'email', 'telefono', 'fecha-nacimiento',
        'especialidad', 'medico', 'tipo-consulta', 'fecha-turno', 'hora-turno',
        'modalidad', 'plataforma', 'cobertura', 'numero-credencial', 'plan',
        'como-nos-conocio', 'motivo-consulta', 'descripcion-estudios'
    ];

    fields.forEach((id) => {
        const field = document.getElementById(id);
        if (!field) return;
        const eventType = field.tagName === 'SELECT' || field.type === 'checkbox' ? 'change' : 'blur';
        field.addEventListener(eventType, () => validateField(field));
    });
}

function validateForm() {
    const fieldIds = [
        'nombre', 'apellido', 'dni', 'email', 'telefono', 'fecha-nacimiento',
        'especialidad', 'medico', 'tipo-consulta', 'fecha-turno', 'hora-turno',
        'modalidad', 'plataforma', 'cobertura', 'numero-credencial', 'plan',
        'como-nos-conocio', 'motivo-consulta', 'descripcion-estudios'
    ];

    let valid = true;
    fieldIds.forEach((id) => {
        const field = document.getElementById(id);
        if (!field) return;
        if (!validateField(field)) {
            valid = false;
        }
    });
    return valid;
}

document.addEventListener('DOMContentLoaded', () => {
    const especialidadSelect = document.getElementById('especialidad');
    const modalidadSelect = document.getElementById('modalidad');
    const coberturaSelect = document.getElementById('cobertura');
    const primeraVisitaCheckbox = document.getElementById('primera-visita');
    const estudiosPreviosCheckbox = document.getElementById('estudios-previos');
    const form = document.getElementById('turno-form');

    updateMedicoOptions();
    updateModalidad();
    updateCobertura();
    updatePrimeraVisita();
    updateEstudiosPrevios();
    attachValidationListeners();

    especialidadSelect.addEventListener('change', () => {
        updateMedicoOptions();
        validateField(especialidadSelect);
        validateField(document.getElementById('medico'));
    });

    modalidadSelect.addEventListener('change', () => {
        updateModalidad();
        validateField(modalidadSelect);
    });

    coberturaSelect.addEventListener('change', () => {
        updateCobertura();
        validateField(coberturaSelect);
    });

    primeraVisitaCheckbox.addEventListener('change', () => {
        updatePrimeraVisita();
        validateField(document.getElementById('como-nos-conocio'));
    });

    estudiosPreviosCheckbox.addEventListener('change', () => {
        updateEstudiosPrevios();
        validateField(document.getElementById('descripcion-estudios'));
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!validateForm()) {
            const firstError = form.querySelector('.campo-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        const nombre = document.getElementById('nombre').value.trim();
        const especialidad = document.querySelector('#especialidad option:checked').textContent;
        const fecha = document.getElementById('fecha-turno').value;
        const hora = document.getElementById('hora-turno').value;
        const turnoId = 'TURN-' + Math.floor(10000 + Math.random() * 90000);
        const confirmacion = document.getElementById('confirmacion-turno');
        confirmacion.innerHTML = `
            <div class="confirmacion-mensaje">
                <h3>Turno confirmado</h3>
                <p><strong>Paciente:</strong> ${nombre}</p>
                <p><strong>Especialidad:</strong> ${especialidad}</p>
                <p><strong>Fecha:</strong> ${fecha}</p>
                <p><strong>Hora:</strong> ${hora}</p>
                <p><strong>Número de turno:</strong> ${turnoId}</p>
            </div>
        `;
        confirmacion.style.display = 'block';
        confirmacion.scrollIntoView({ behavior: 'smooth' });
    });
});
