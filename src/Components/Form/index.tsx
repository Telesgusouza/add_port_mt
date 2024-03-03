import React, { useEffect, useState } from "react";
import * as Styled from "./styled";

import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../../Config/Firebase/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { toast } from "react-toastify";
import {
  IAboutMe,
  IComment,
  ILinksSocialMidia,
  ILoadingButton,
  IDesign,
  IFilter,
} from "../../Config/interfaces";

export default function Form() {
  const [loadingButton, setLoadingButton] = useState<ILoadingButton>({
    btn: "",
  });
  const [currentFilter, setCurrentFilter] = useState<string>("");
  const [radio, setRadio] = useState<string>("1");

  const [photoDesign, setPhotoDesign] = useState<null | File>(null);
  const [title, setTitle] = useState<string>("");
  const [decription, setDecription] = useState<string>("");

  const [optionFilter, setOptionFilter] = useState<string>("");
  const [listFilter, setListFilter] = useState<IFilter[]>([]);

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

  const [listDesigns, setListDesigns] = useState<IDesign[]>([]);
  const [currentData, setCurrentData] = useState<IDesign | null>(null);

  useEffect(() => {
    async function getListData() {
      try {
        const listData = await getDocs(collection(db, "/design/mt/data"));
        const list: IDesign[] = [];
        listData.docs.forEach((element: DocumentData) => {
          list.push({
            id: element.id,
            date: element.data().date,
            filter: element.data().filter,
            design: element.data().design,
            title: element.data().title,
            decription: element.data().decription,
          });
        });

        setListDesigns(list);
      } catch (e) {
        console.error("Error ", e);
        toast.error("Erro ao trazer designs");
      }
    }

    getListData();

    return () => {};
  }, [currentData]);

  useEffect(() => {
    async function getFilters() {
      try {
        const list: IFilter[] = [];
        const getFilters = await getDocs(collection(db, "/data/mt/filters"));

        getFilters.docs.forEach((doc: DocumentData) => {
          const obj: IFilter = {
            id: doc.id,
            filter: doc.data().filter,
          };
          list.push(obj);
        });

        setListFilter(list);
      } catch (e) {
        console.error("Error ", e);
        toast.error("Erro ao trazer filtros");
      }
    }

    getFilters();

    return () => {};
  }, [loadingButton]);

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

  function handleEditDesing(data: IDesign) {
    setToggleViewEditDesign(true);
    setCurrentData(data);
  }
  async function submitNewDesign(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();

    let objData: IDesign = {
      date: new Date(),
      filter: "",
      decription: "",
      design: null,
      title: "",
    };

    if (loadingButton.btn === "NEW_DESIGN" && currentFilter) {
      objData = {
        date: new Date(),
        filter: currentFilter,
        design: null,
        title: title,
        decription: decription,
      };
    } else {
      toast.warn("Preencha o campo Design para prosseguir");
      setLoadingButton({ btn: "" });
      return;
    }

    await submit("design/mt/data", "design/data", objData, photoDesign);
  }

  async function submitSocialMidiaAndIcon(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();
    try {
      const url = "data/socialmidia";
      const getData: DocumentData = await getDoc(doc(db, url));

      const obj = {
        instagram:
          instagram.trim().length > 0 ? instagram : getData.data().instagram,
        linkedin:
          linkedin.trim().length > 0 ? linkedin : getData.data().linkedin,
        whatsapp:
          whatsapp.trim().length > 0 ? whatsapp : getData.data().whatsapp,
      };

      if (
        instagram.trim().length === 0 &&
        linkedin.trim().length === 0 &&
        whatsapp.trim().length === 0 &&
        photoIcone === null
      ) {
        toast.warn(
          "Preencha pelo menos um campo (seção Links e icone) para editar"
        );
        setLoadingButton({ btn: "" });
        return;
      }

      submit(url, "data/icon", obj, photoIcone);
    } catch (e) {
      console.error("Error ", e);
    }
  }

  async function submitAboutMe(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();
    try {
      const url: string = "data/aboutme";
      const getObj: DocumentData = await getDoc(doc(db, url));

      if (aboutMe.trim().length === 0 && avatarAdmin === null) {
        toast.warn(
          "Preencha pelo menos um campo (seção sobre mim) para editar"
        );
        return;
      }

      submit(
        url,
        "data/aboutme",
        {
          description:
            aboutMe.trim().length > 0 ? aboutMe : getObj.data().description,
        },
        avatarAdmin
      );
    } catch (e) {
      toast.error('Error ao adicionar os dados "sobre mim" ');
      console.error("Error ", e);
    }
  }

  async function submitEditComment(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();
    try {
      const url = "data/mt/comments/" + radio;
      const getData: DocumentData = await getDoc(doc(db, url));

      const newData: IComment = {
        avatar: avatarClient === null ? getData.data().avatar : null,
        name: nameClient.trim().length > 0 ? nameClient : getData.data().name,
        description:
          decriptionClient.trim().length > 0
            ? decriptionClient
            : getData.data().description,
      };

      submit(url, url, newData, avatarClient);
    } catch (e) {
      toast.error("Ocorreu um erro ao editar comentario");
      console.error("Error ", e);
    }
  }

  async function submitEditDesign(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();
    try {
      if (currentData) {
        const data = {
          filter: currentData?.filter,
          date: currentData?.date,
          design: editDesign === null ? currentData?.design : null,
          title:
            editTitleDesign === null ? currentData?.title : editTitleDesign,
          decription:
            editDescriptionDesign === null
              ? currentData?.decription
              : editDescriptionDesign,
        };

        submit(
          "/design/mt/data/" + currentData.id,
          "/design/data/" + currentData.id,
          data,
          editDesign
        );
      }
    } catch (e) {
      console.error(e);
      toast.error("Error ao editar Design");
    }
  }

  async function submitNewFilter(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();
    try {
      if (optionFilter.trim().length > 0) {
        await addDoc(collection(db, "data/mt/filters"), {
          filter: optionFilter,
        });

        setOptionFilter("");
        setLoadingButton({ btn: "" });

        toast.success("Novo filtro adicionado com sucesso");
      } else {
        toast.warn("Para prosseguir preencha o campo");
      }
    } catch (e) {
      console.error("Error ", e);
      toast.error("Ocorreu um erro ao adicionar um novo filtro");
    }
  }

  async function submit(
    url: string,
    urlStorage: string,

    obj: IComment | IDesign | ILinksSocialMidia | IAboutMe,
    photo: File | null
  ) {
    try {
      switch (loadingButton.btn) {
        case "NEW_DESIGN": {
          if (photo) {
            const data = await addDoc(collection(db, url), obj);
            const idData = data.id;

            const getDesign = await uploadPhoto(
              urlStorage + "/" + idData,
              photo
            );

            await editTask(url + "/" + idData, {
              date: new Date(),
              filter: currentFilter,
              design: getDesign,
              title: title,
              decription: decription,
            });

            setTitle("");
            setDecription("");
            setPhotoDesign(null);

            toast.success("Design adicionado com sucesso");
          }
          break;
        }

        case "LINK_AND_ICON": {
          await setDoc(doc(db, url), obj);
          if (photo) await uploadPhoto(urlStorage, photo);

          setInstagram("");
          setLinkedin("");
          setWhatsapp("");
          setPhotoIcone(null);

          toast.success("Links e icone editado com sucesso");
          break;
        }

        case "ABOUT_ME": {
          await setDoc(doc(db, url), obj);
          if (photo) await uploadBytes(ref(storage, urlStorage), photo);

          setAvatarAdmin(null);
          setAboutMe("");

          toast.success("Sobre mim editado com sucesso");

          break;
        }

        case "EDIT_COMMENT": {
          await setDoc(doc(db, url), obj);
          if (photo) {
            await uploadBytes(ref(storage, urlStorage), photo);
            const getDesign = await getDownloadURL(ref(storage, urlStorage));
            if ("avatar" in obj && "name" in obj && "description" in obj) {
              const objData: IComment = obj;
              objData.avatar = getDesign;
              await editTask(url, obj);
            }

            setNameClient("");
            setDecriptionClient("");
            setAvatarClient(null);
            toast.success("Comentario salvo com sucesso");
          }
          break;
        }

        case "EDIT_DESIGN": {
          if (photo && "design" in obj) {
            console.log("Estamos squi");
            await uploadBytes(ref(storage, urlStorage), photo);
            const getData = await getDownloadURL(ref(storage, urlStorage));

            obj.design = getData;
          }
          await setDoc(doc(db, url), obj);

          setEditDesign(null);
          setEditDescriptionDesign("");
          setEditTitleDesign("");

          setCurrentData(null);
          setToggleViewEditDesign(false);

          toast.success("Design Editado com sucesso");
          break;
        }
      }
    } catch (e) {
      console.error("Error ", e);
      toast.error("Ocorreu um erro");
    } finally {
      setLoadingButton({ btn: "" });
    }
  }

  async function editTask(url: string, obj: IDesign | IComment) {
    try {
      await setDoc(doc(db, url), obj);
    } catch (e) {
      console.error("Error ", e);
      toast.error("Erro ao editar task");
    }
  }

  async function uploadPhoto(url: string, photo: File) {
    const refStorage = ref(storage, url);

    await uploadBytes(refStorage, photo);
    const getDesign = await getDownloadURL(refStorage);
    return getDesign;
  }

  async function handleDelete() {
    try {
      if (currentData) {
        await deleteObject(ref(storage, "/design/data/" + currentData.id));
        await deleteDoc(doc(db, "/design/mt/data/" + currentData.id));

        setLoadingButton({ btn: "" });
        setCurrentData(null);
        setToggleViewEditDesign(false);
        toast.success("Design apagado com sucesso");
      }
    } catch (e) {
      toast.error("Ocorreu um erro ao deletar tarefa");
      console.error("Error ao deletar design ", e);
    }
  }

  async function deleteFilter(resp: IFilter) {
    try {
      await deleteDoc(doc(db, "/data/mt/filters/" + resp.id));
      toast.success("Filtro deletado com sucesso, reinicie a página");
    } catch (e) {
      console.error("Error ", e);
      toast.error("Erro ao deletar filtro");
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

          {currentFilter.trim().length > 0 && (
            <Styled.ListDesigns>
              <span>Opção selecionada</span>
              <ul>
                <li>{currentFilter}</li>
              </ul>
            </Styled.ListDesigns>
          )}

          <Styled.ListDesigns>
            <span>Selecione uma das opções</span>
            <ul>
              {listFilter.length > 0 &&
                listFilter.map((resp) => (
                  <li onClick={() => setCurrentFilter(resp.filter)} key={resp.id} >
                    {resp.filter}
                  </li>
                ))}
            </ul>
          </Styled.ListDesigns>

          <Styled.Button
            type="submit"
            onClick={() => setLoadingButton({ btn: "NEW_DESIGN" })}
          >
            {loadingButton.btn !== "" && loadingButton.btn === "NEW_DESIGN"
              ? "carregando"
              : "Add design"}
          </Styled.Button>
        </form>

        <hr />
        <h3>Adicione e retire os filtros</h3>
        <form onSubmit={submitNewFilter}>
          <label htmlFor="">
            <input
              type="text"
              placeholder="Adicionar novo filtro"
              value={optionFilter}
              onChange={(e) => setOptionFilter(e.target.value)}
            />
          </label>

          <Styled.Button
            type="submit"
            onClick={() => setLoadingButton({ btn: "NEW_FILTER" })}
          >
            {loadingButton.btn !== "" && loadingButton.btn === "NEW_FILTER"
              ? "carregando"
              : "Adicionar filtro"}
          </Styled.Button>

          <Styled.ListDesigns>
            <span>Clique em uma das opções para apagar ela</span>
            <ul>
              {listFilter.length > 0 &&
                listFilter.map((resp) => (
                  
                    <li onClick={() => deleteFilter(resp)} key={resp.id} >{resp.filter}</li>
                  
                ))}
            </ul>
          </Styled.ListDesigns>
        </form>

        <hr />
        <h3>Seu icone e Links</h3>
        <form onSubmit={submitSocialMidiaAndIcon}>
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
            onClick={() => setLoadingButton({ btn: "LINK_AND_ICON" })}
          >
            {loadingButton.btn !== "" && loadingButton.btn === "LINK_AND_ICON"
              ? "carregando"
              : "Editar links/icone"}
          </Styled.Button>
        </form>

        <hr />
        <h3>Sobre mim</h3>
        <form onSubmit={submitAboutMe}>
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
          <Styled.Button
            type="submit"
            onClick={() => setLoadingButton({ btn: "ABOUT_ME" })}
          >
            {loadingButton.btn !== "" && loadingButton.btn === "ABOUT_ME"
              ? "carregando"
              : "add/atualizar descrição"}
          </Styled.Button>
        </form>
      </Styled.Container>

      <Styled.Container>
        <h1>Editar</h1>
        <span>Editar Designs e Comentarios </span>
        <hr />

        <h3>Comentarios</h3>
        <form onSubmit={submitEditComment}>
          <ul>
            <li>
              <input
                type="radio"
                checked={radio === "1"}
                value={"1"}
                onChange={(e) => setRadio(e.target.value)}
                name="comments"
              />{" "}
              #1
            </li>
            <li>
              <input
                type="radio"
                checked={radio === "2"}
                value={"2"}
                onChange={(e) => setRadio(e.target.value)}
                name="comments"
              />{" "}
              #2
            </li>
            <li>
              <input
                type="radio"
                checked={radio === "3"}
                value={"3"}
                onChange={(e) => setRadio(e.target.value)}
                name="comments"
              />{" "}
              #3
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
          <Styled.Button
            type="submit"
            onClick={() => setLoadingButton({ btn: "EDIT_COMMENT" })}
          >
            {loadingButton.btn !== "" && loadingButton.btn === "EDIT_COMMENT"
              ? "carregando"
              : "Editar Comentario"}
          </Styled.Button>
        </form>

        <hr />
        <h3>Editar designs</h3>
        <form onSubmit={submitEditDesign}>
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

              <Styled.ListDesigns>
                <span>Filtro</span>
                <ul>
                  <li>{currentData?.filter}</li>
                </ul>
              </Styled.ListDesigns>

              <Styled.DivButton>
                <Styled.Button
                  type="submit"
                  onClick={() => setLoadingButton({ btn: "EDIT_DESIGN" })}
                >
                  {loadingButton.btn !== "" &&
                  loadingButton.btn === "EDIT_DESIGN"
                    ? "carregando"
                    : "Editar"}
                </Styled.Button>

                <button onClick={handleDelete}>Deletar Design</button>
              </Styled.DivButton>
            </>
          )}

          <Styled.Ul>
            {listDesigns.length > 0 ? (
              listDesigns.map((resp) => (
                <li onClick={() => handleEditDesing(resp)} key={resp.id}>
                  <img src={resp.design ? resp.design : ""} alt="design" />
                </li>
              ))
            ) : (
              <>
                <strong>Não a designs no momento</strong>
              </>
            )}
          </Styled.Ul>
        </form>
      </Styled.Container>
    </>
  );
}
