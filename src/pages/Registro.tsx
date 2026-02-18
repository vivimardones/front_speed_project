import React, { useState } from "react";
import "../styles/Login.css";
import { registrarUsuario } from "../services/registroService";

const tipoIdentificadores = [
  { label: "RUT", value: "RUT" },
  { label: "RUT Provisorio", value: "RUT_PROVISORIO" },
  { label: "Pasaporte", value: "PASAPORTE" },
  { label: "Otro Identificador", value: "IDENTIFICADOR_EXTRANJERO" },
];
const sexos = [
  { label: "Femenino", value: "femenino" },
  { label: "Masculino", value: "masculino" },
];

function validarEmail(email: string) {
  // Validador simple
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validarRut(rut: string) {
  rut = rut.replace(/[^0-9kK]/g, "").toUpperCase();
  if (rut.length < 2) return false;
  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1).toUpperCase();
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  const dvNum = 11 - (suma % 11);
  let dvEsperado: string;
  if (dvNum === 11) dvEsperado = "0";
  else if (dvNum === 10) dvEsperado = "K";
  else dvEsperado = String(dvNum);

  return dv === dvEsperado;
}
function validarTelefono(fono: string) {
  // Chile: "+569XXXXXXXX"
  return /^\+56\d{9}$/.test(fono);
}

function Registro() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    correo: "",
    password: "",
    repetirPassword: "",
    primerNombre: "",
    segundoNombre: "",
    tercerNombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    sexo: "",
    tipoIdentificador: "",
    numeroIdentificador: "",
    telefono: "",
    telefonoEmergencia: "",
  });

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // -------- VALIDACIONES POR PASO ---------
  function validarPasswordCompleja(pass: string) {
    // Al menos una mayúscula, una minúscula y un número, mínimo 8 caracteres
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass);
  }

  function validarStep1() {
    const errs: { [k: string]: string } = {};
    if (!form.correo) errs.correo = "El correo es obligatorio";
    else if (!validarEmail(form.correo)) errs.correo = "Correo inválido";
    if (!form.password) errs.password = "La contraseña es obligatoria";
    else if (!validarPasswordCompleja(form.password))
      errs.password =
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número y mínimo 8 caracteres";
    if (!form.repetirPassword) errs.repetirPassword = "Repita la contraseña";
    if (
      form.password &&
      form.repetirPassword &&
      form.password !== form.repetirPassword
    )
      errs.repetirPassword = "Las contraseñas no coinciden";
    return errs;
  }

  function validarStep2() {
    const errs: { [k: string]: string } = {};
    if (!form.primerNombre) errs.primerNombre = "Campo obligatorio";
    if (!form.apellidoPaterno) errs.apellidoPaterno = "Campo obligatorio";
    if (!form.apellidoMaterno) errs.apellidoMaterno = "Campo obligatorio";
    return errs;
  }

  function validarStep3() {
    const errs: { [k: string]: string } = {};
    if (!form.fechaNacimiento) errs.fechaNacimiento = "Campo obligatorio";
    else {
      const edad = calcularEdad(form.fechaNacimiento);
      if (edad < 10)
        errs.fechaNacimiento =
          "No se permiten registros para menores de 10 años";
    }
    if (!form.sexo) errs.sexo = "Campo obligatorio";
    if (!form.tipoIdentificador) errs.tipoIdentificador = "Campo obligatorio";
    if (!form.numeroIdentificador)
      errs.numeroIdentificador = "Campo obligatorio";
    else if (
      (form.tipoIdentificador === "RUT" ||
        form.tipoIdentificador === "RUT_PROVISORIO") &&
      !validarRut(form.numeroIdentificador)
    )
      errs.numeroIdentificador = "RUT inválido";
    else if (
      form.tipoIdentificador === "PASAPORTE" &&
      form.numeroIdentificador.trim().length < 6 &&
      form.numeroIdentificador.trim().length > 20
    )
      errs.numeroIdentificador = "Pasaporte inválido";
    if (!form.telefono) errs.telefono = "Campo obligatorio";
    else if (!validarTelefono(form.telefono))
      errs.telefono = "Formato: +569XXXXXXXX";
    if (form.telefonoEmergencia && !validarTelefono(form.telefonoEmergencia))
      errs.telefonoEmergencia = "Formato: +569XXXXXXXX";
    return errs;
  }
  function calcularEdad(fechaNacimiento: string) {
    const hoy = new Date();
    const fn = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fn.getFullYear();
    const m = hoy.getMonth() - fn.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fn.getDate())) {
      edad--;
    }
    return edad;
  }

  // ------- STEP 1 -------
  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validarStep1();
    setErrors(v);
    if (Object.keys(v).length === 0) setStep(2);
  };

  // ------- STEP 2 -------
  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validarStep2();
    setErrors(v);
    if (Object.keys(v).length === 0) setStep(3);
  };

  // ------- STEP 3 -------
  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validarStep3();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setLoading(true);
    setSuccess("");
    setErrors({});
    try {
      // aquí eliminamos repetirPassword del request
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { repetirPassword, ...cloneForm } = form;
      const payload: Record<string, string> = { ...cloneForm };
      if (!cloneForm.telefonoEmergencia?.trim()) {
        delete payload.telefonoEmergencia;
      }
      await registrarUsuario(payload);
      setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
    } catch (err) {
      const axiosError = err as {
        response?: {
          data?: {
            message?: string | string[];
          };
        };
      };
      const msg = axiosError.response?.data?.message;
      setErrors({ api: Array.isArray(msg) ? msg.join(", ") : msg || "Error desconocido" });
    } finally {
      setLoading(false);
    }
  };

  // --------- RENDER --------
  if (success) {
    return (
      <div className="login-container">
        <h2>Registro exitoso</h2>
        <p>{success}</p>
        {/* Aquí puedes poner un botón para ir a inicio de sesión */}
      </div>
    );
  }

  // PASO 1
  if (step === 1) {
    return (
      <div className="login-container">
        <h2>Crear Cuenta - Paso 1 de 3</h2>
        <form onSubmit={handleStep1}>
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            placeholder="ejemplo@correo.com"
            required
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            disabled={loading}
          />
          {errors.correo && <span className="error">{errors.correo}</span>}

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Contraseña"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
          />
          {errors.password && <span className="error">{errors.password}</span>}

          <label htmlFor="repetirPassword">Repetir Contraseña</label>
          <input
            type="password"
            id="repetirPassword"
            name="repetirPassword"
            placeholder="Repetir Contraseña"
            required
            value={form.repetirPassword}
            onChange={(e) =>
              setForm({ ...form, repetirPassword: e.target.value })
            }
            disabled={loading}
          />
          {errors.repetirPassword && (
            <span className="error">{errors.repetirPassword}</span>
          )}

          {errors.api && <span className="error">{errors.api}</span>}
          <button type="submit" disabled={loading}>
            Avanzar
          </button>
        </form>
      </div>
    );
  }

  // PASO 2
  if (step === 2) {
    return (
      <div className="login-container">
        <h2>Crear Cuenta - Paso 2 de 3</h2>
        <form onSubmit={handleStep2}>
          <label htmlFor="primerNombre">Primer Nombre</label>
          <input
            type="text"
            id="primerNombre"
            name="primerNombre"
            placeholder="Ingrese Nombre"
            required
            value={form.primerNombre}
            onChange={(e) => setForm({ ...form, primerNombre: e.target.value })}
            disabled={loading}
          />
          {errors.primerNombre && (
            <span className="error">{errors.primerNombre}</span>
          )}

          <label htmlFor="segundoNombre">Segundo Nombre</label>
          <input
            type="text"
            id="segundoNombre"
            name="segundoNombre"
            placeholder="Ingrese Segundo Nombre"
            value={form.segundoNombre}
            onChange={(e) =>
              setForm({ ...form, segundoNombre: e.target.value })
            }
            disabled={loading}
          />

          <label htmlFor="tercerNombre">Tercer Nombre</label>
          <input
            type="text"
            id="tercerNombre"
            name="tercerNombre"
            placeholder="Ingrese Tercer Nombre"
            value={form.tercerNombre}
            onChange={(e) => setForm({ ...form, tercerNombre: e.target.value })}
            disabled={loading}
          />

          <label htmlFor="apellidoPaterno">Apellido Paterno</label>
          <input
            type="text"
            id="apellidoPaterno"
            name="apellidoPaterno"
            placeholder="Ingrese Apellido Paterno"
            required
            value={form.apellidoPaterno}
            onChange={(e) =>
              setForm({ ...form, apellidoPaterno: e.target.value })
            }
            disabled={loading}
          />
          {errors.apellidoPaterno && (
            <span className="error">{errors.apellidoPaterno}</span>
          )}

          <label htmlFor="apellidoMaterno">Apellido Materno</label>
          <input
            type="text"
            id="apellidoMaterno"
            name="apellidoMaterno"
            placeholder="Ingrese Apellido Materno"
            required
            value={form.apellidoMaterno}
            onChange={(e) =>
              setForm({ ...form, apellidoMaterno: e.target.value })
            }
            disabled={loading}
          />
          {errors.apellidoMaterno && (
            <span className="error">{errors.apellidoMaterno}</span>
          )}

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" onClick={() => setStep(1)} disabled={loading}>
              Atrás
            </button>
            <button type="submit" disabled={loading}>
              Avanzar
            </button>
          </div>
        </form>
      </div>
    );
  }

  // PASO 3
  return (
    <div className="login-container">
      <h2>Crear Cuenta - Paso 3 de 3</h2>
      <form onSubmit={handleStep3}>
        <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
        <input
          type="date"
          id="fechaNacimiento"
          name="fechaNacimiento"
          required
          value={form.fechaNacimiento}
          onChange={(e) =>
            setForm({ ...form, fechaNacimiento: e.target.value })
          }
          disabled={loading}
        />
        {errors.fechaNacimiento && (
          <span className="error">{errors.fechaNacimiento}</span>
        )}

        <label htmlFor="sexo">Sexo</label>
        <select
          id="sexo"
          name="sexo"
          required
          value={form.sexo}
          onChange={(e) => setForm({ ...form, sexo: e.target.value })}
          disabled={loading}
        >
          <option value="">Selecciona una opción</option>
          {sexos.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {errors.sexo && <span className="error">{errors.sexo}</span>}

        <label htmlFor="tipoIdentificador">Tipo de Identificador</label>
        <select
          id="tipoIdentificador"
          name="tipoIdentificador"
          required
          value={form.tipoIdentificador}
          onChange={(e) =>
            setForm({ ...form, tipoIdentificador: e.target.value })
          }
          disabled={loading}
        >
          <option value="">Selecciona una opción</option>
          {tipoIdentificadores.map((id) => (
            <option key={id.value} value={id.value}>
              {id.label}
            </option>
          ))}
        </select>
        {errors.tipoIdentificador && (
          <span className="error">{errors.tipoIdentificador}</span>
        )}

        <label htmlFor="numeroIdentificador">Número de Identificador</label>
        <input
          type="text"
          id="numeroIdentificador"
          name="numeroIdentificador"
          placeholder="Ej: 12.345.678-9"
          required
          value={form.numeroIdentificador}
          onChange={(e) =>
            setForm({ ...form, numeroIdentificador: e.target.value })
          }
          disabled={loading}
        />
        {errors.numeroIdentificador && (
          <span className="error">{errors.numeroIdentificador}</span>
        )}

        <label htmlFor="telefono">Teléfono</label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          placeholder="Ej: +56912345678"
          required
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          disabled={loading}
        />
        {errors.telefono && <span className="error">{errors.telefono}</span>}

        <label htmlFor="telefonoEmergencia">Teléfono de Emergencia</label>
        <input
          type="tel"
          id="telefonoEmergencia"
          name="telefonoEmergencia"
          placeholder="Ej: +56999999999"
          value={form.telefonoEmergencia}
          onChange={(e) =>
            setForm({ ...form, telefonoEmergencia: e.target.value })
          }
          disabled={loading}
        />
        {errors.telefonoEmergencia && (
          <span className="error">{errors.telefonoEmergencia}</span>
        )}

        {errors.api && <span className="error">{errors.api}</span>}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button type="button" onClick={() => setStep(2)} disabled={loading}>
            Atrás
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Registro;
