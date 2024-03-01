import React, { useState } from "react";
import * as Styled from "./styled";

import noUser from "../../assets/caveira_de_tim.jpg";
import { DocumentData, collection } from "firebase/firestore";
import { db, storage } from "../../Config/Firebase/firebase";
import { ref } from "firebase/storage";

interface ILoadingButton {
  btn:
    | ""
    | "NEW_DESIGN"
    | "LINK_AND_ICON"
    | "ABOUT_ME"
    | "EDIT_COMMENT"
    | "EDIT_DESIGN";
}

export default function Form() {
  const [loadingButton, setLoadingButton] = useState<ILoadingButton>({
    btn: "",
  });

  const [photoDesign, setPhotoDesign] = useState<null | File>(null);
  const [title, setTitle] = useState<string>("");
  const [decription, setDecription] = useState<string>("");

  const [photoIcone, setPhotoIcone] = useState<null | File>(null);
  const [instagram, setInstagram] = useState<string>("");
  const [linkedin, setLinkedin] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");

  const [avatarAdmin, setAvatarAdmin] = useState<null | File>(null);
  const [aboutMe, setAboutMe] = useState<string>("");

  const [avatarClient, setAvatarClient] = useState<null | File>(null);
  const [nameClient, setNameClient] = useState<string>("");
  const [decriptionClient, setDecriptionClient] = useState<string>("");

  const [editDesign, setEditDesign] = useState<null | File>(null);
  const [editTitleDesign, setEditTitleDesign] = useState<string>("");
  const [editDescriptionDesign, setEditDescriptionDesign] =
    useState<string>("");

  const [toggleViewEditDesign, setToggleViewEditDesign] =
    useState<boolean>(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement> | null) {
    if (e && e.target.files && e.target.files.length > 0) {
      const file = e.target.files?.[0];

      if (file && file.type.startsWith("image/")) {
        return file;
      }
      return null;
    }
  }

  function handlePhoto(
    e: React.ChangeEvent<HTMLInputElement> | null,
    secPhoto: string
  ) {
    const file = handleFile(e);
    if (file === undefined) {
      throw new Error("Error finding photo");
    }

    switch (secPhoto) {
      case "NEW_DESIGN": {
        setPhotoDesign(file);
        break;
      }

      case "ICONE": {
        setPhotoIcone(file);
        break;
      }

      case "AVATAR_CLIENT": {
        setAvatarClient(file);
        break;
      }

      case "AVATAR_ADMIN": {
        setAvatarAdmin(file);
        break;
      }

      case "EDIT_DESIGN": {
        setEditDesign(file);
        break;
      }
    }
  }

  function handleEditDesing() {
    setToggleViewEditDesign(true);
  }

  async function submitNewDesign(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();

    let urlCollection: string = "";
    let urlStorage: string = "";

    switch (loadingButton.btn) {
      case "NEW_DESIGN": {
        urlCollection = "design/mt/data";
        urlStorage = "design/data";
        break;
      }
    }

    await submit(collection(db, urlCollection), ref(storage, urlStorage), undefined);

    // APAGAR/ignorar
    await editTask("", undefined);
  }

  async function submit(
    urlCollection: DocumentData,
    urlStorage: DocumentData,
    obj: undefined
  ) {
    try {
      /*
      subir sem se conectar dados e foto
      */
      const a = {
        a: urlCollection,
        b: urlStorage,
        c: obj,
      };
      a;
    } catch (e) {
      console.error("Error ", e);
    }
  }

  /*
  seguinte, quando salvamos, primeiro salvamos sem foto logo em seguida salvamos com foto e 
  EDITAMOS a task adicionando a foto

  já editar task edita a task
  */
  async function editTask(id: string, obj: undefined) {
    try {
      const a = {
        a: id,
        b: obj,
      };
      a;
    } catch (e) {
      console.error("Error ", e);
    }
  }

  return (
    <>
      <Styled.Container>
        <h1>Adicionar e Editar</h1>
        <span>Toda a parte de manipulação do conteudo</span>
        <hr />

        <h3>+ NOVO design</h3>
        <form onSubmit={submitNewDesign}>
          <label htmlFor="design">
            Design
            <Styled.InputFile>
              <span>Solte aqui ou clique na caixa</span>
              {photoDesign && (
                <>
                  <img src={URL.createObjectURL(photoDesign)} alt="" />
                </>
              )}
              <input
                type="file"
                onChange={(e) => handlePhoto(e, "NEW_DESIGN")}
              />
            </Styled.InputFile>
          </label>
          <label htmlFor="titulo">
            Titulo (Não obrigatório)
            <input
              type="text"
              placeholder="Digite seu titulo"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </label>
          <label htmlFor="descricao">
            Descrição (Não obrigatório)
            <textarea
              placeholder="Digite sua descrição"
              value={decription}
              onChange={(e) => setDecription(e.target.value)}
            ></textarea>
          </label>

          <Styled.Button
            type="submit"
            onClick={() => setLoadingButton({ btn: "NEW_DESIGN" })}
            // disabled={
            //   loadingButton.btn !== "" && loadingButton.btn === "NEW_DESIGN"
            //     ? true
            //     : false
            // }
          >
            {loadingButton.btn !== "" && loadingButton.btn === "NEW_DESIGN"
              ? "carregando"
              : "Add design"}
          </Styled.Button>
        </form>

        <hr />
        <h3>Seu icone e Links</h3>
        <form action="">
          <label htmlFor="icone">
            Seu icone
            <Styled.InputFile>
              <span>Solte aqui ou clique na caixa</span>
              {photoIcone && (
                <>
                  <img src={URL.createObjectURL(photoIcone)} alt="" />
                </>
              )}
              <input type="file" onChange={(e) => handlePhoto(e, "ICONE")} />
            </Styled.InputFile>
          </label>
          <label htmlFor="instagram">
            instagram (não obrigatório)
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Link do instagram"
            />
          </label>

          <label htmlFor="linkedin">
            linkedin (não obrigatório)
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="Link do linkedin"
            />
          </label>

          <label htmlFor="whatsapp">
            whatsapp (não obrigatório)
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Link do whatsapp"
            />
          </label>
          <Styled.Button
            type="submit"
            onClick={() => setLoadingButton({ btn: "NEW_DESIGN" })}
          >
            {loadingButton.btn !== "" && loadingButton.btn === "LINK_AND_ICON"
              ? "carregando"
              : "Editar links/icone"}
          </Styled.Button>
        </form>

        <hr />
        <h3>Sobre mim</h3>
        <form action="">
          <label htmlFor="Seu avatar">
            Sua foto
            <Styled.InputFile>
              <span>Solte aqui ou clique na caixa</span>
              {avatarAdmin && (
                <>
                  <img src={URL.createObjectURL(avatarAdmin)} alt="" />
                </>
              )}
              <input
                type="file"
                onChange={(e) => handlePhoto(e, "AVATAR_ADMIN")}
              />
            </Styled.InputFile>
          </label>
          <label htmlFor="description">
            <textarea
              placeholder="Texto Sobre mim"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
            ></textarea>
          </label>
          <Styled.Button>add/atualizar descrição</Styled.Button>
        </form>
      </Styled.Container>

      <Styled.Container>
        <h1>Editar</h1>
        <span>Editar Designs e Comentarios </span>
        <hr />

        <h3>Comentarios</h3>
        <form action="">
          <ul>
            <li>
              <input type="radio" name="comments" /> #1
            </li>
            <li>
              <input type="radio" name="comments" /> #2
            </li>
            <li>
              <input type="radio" name="comments" /> #3
            </li>
          </ul>

          <label htmlFor="avatar client">
            avatar cliente (Não obrigatório)
            <Styled.InputFile>
              <span>Solte aqui ou clique na caixa</span>
              {avatarClient && (
                <>
                  <img src={URL.createObjectURL(avatarClient)} alt="" />
                </>
              )}
              <input
                type="file"
                onChange={(e) => handlePhoto(e, "AVATAR_CLIENT")}
              />
            </Styled.InputFile>
          </label>
          <label htmlFor="nome">
            Nome
            <input
              type="text"
              value={nameClient}
              onChange={(e) => setNameClient(e.target.value)}
            />
          </label>
          <label htmlFor="descricao cliente">
            Descrição
            <textarea
              placeholder="descrição do comentario"
              value={decriptionClient}
              onChange={(e) => setDecriptionClient(e.target.value)}
            ></textarea>
          </label>
          <Styled.Button>Editar Comentario</Styled.Button>
        </form>

        <hr />
        <h3>Editar designs</h3>
        <form action="">
          {toggleViewEditDesign && (
            <>
              <label htmlFor="design">
                design
                <Styled.InputFile>
                  <span>Solte aqui ou clique na caixa</span>
                  {editDesign && (
                    <>
                      <img src={URL.createObjectURL(editDesign)} alt="" />
                    </>
                  )}
                  <input
                    type="file"
                    onChange={(e) => handlePhoto(e, "EDIT_DESIGN")}
                  />
                </Styled.InputFile>
              </label>
              <label htmlFor="title">
                Titulo
                <input
                  type="text"
                  placeholder="Titulo do design"
                  value={editTitleDesign}
                  onChange={(e) => setEditTitleDesign(e.target.value)}
                />
              </label>

              <label htmlFor="descricao">
                Descrição
                <textarea
                  placeholder="Descrição do design"
                  value={editDescriptionDesign}
                  onChange={(e) => setEditDescriptionDesign(e.target.value)}
                ></textarea>
              </label>

              <Styled.Button>Editar</Styled.Button>
            </>
          )}

          <Styled.Ul>
            <li onClick={handleEditDesing}>
              <img src={noUser} alt="design" />
            </li>
            <li onClick={handleEditDesing}>
              <img src={noUser} alt="design" />
            </li>
            <li>
              <img src={noUser} alt="design" />
            </li>
            <li>
              <img src={noUser} alt="design" />
            </li>
            <li>
              <img src={noUser} alt="design" />
            </li>
            <li>
              <img src={noUser} alt="design" />
            </li>
            <li>
              <img src={noUser} alt="design" />
            </li>
            <li>
              <img src={noUser} alt="design" />
            </li>
          </Styled.Ul>
        </form>
      </Styled.Container>
    </>
  );
}
