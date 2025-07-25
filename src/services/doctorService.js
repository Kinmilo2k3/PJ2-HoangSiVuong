import e from "express";
import db from "../models/index";

let getTopDoctorHome = (limitInput) => {
      return new Promise(async (resolve, reject) => {
            try {
                  let users = await db.User.findAll({
                        limit: limitInput,
                        where: { roleId: 'R2' },
                        order: [['createdAt', 'DESC']],
                        attributes: {
                              exclude: ['password']
                        },
                        include: [
                              { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                              { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                        ],
                        raw: true,
                        nest: true
                  })

                  resolve({
                        errCode: 0,
                        data: users
                  })
            } catch (e) {
                  reject(e);
            }
      })
}

let getAllDoctors = () => {
      return new Promise(async (resolve, reject) => {
            try {
                  let doctors = await db.User.findAll({
                        where: { roleId: 'R2' },
                        attributes: {
                              exclude: ['password', 'image']
                        }
                  })
                  resolve({
                        errCode: 0,
                        data: doctors
                  })
            } catch (e) {
                  reject(e);
            }
      })
}

let saveDetailInfoDoctor = (inputData) => {
      return new Promise(async (resolve, reject) => {
            try {
                  console.log('inputData:', inputData);
                  if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action) {
                        resolve({
                              errCode: 1,
                              message: 'Missing required parameters!'
                        })
                  } else {
                        if (inputData.action === 'CREATE') {
                              await db.Markdown.create({
                                    contentHTML: inputData.contentHTML,
                                    contentMarkdown: inputData.contentMarkdown,
                                    description: inputData.description,
                                    doctorId: inputData.doctorId
                              })
                        } else {
                              if (inputData.action === 'EDIT') {
                                    let doctorMarkdown = await db.Markdown.findOne({
                                          where: { doctorId: inputData.doctorId },
                                          raw: false
                                    })
                              }
                              if (doctorMarkdown) {
                                    doctorMarkdown.contentHTML = inputData.contentHTML;
                                    doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                                    doctorMarkdown.description = inputData.description;
                                    doctorMarkdown.updateAt = new Date();
                                    await doctorMarkdown.save();
                              }
                        }
                  }
                  resolve({
                        errCode: 0,
                        errMessage: 'Save info doctor succeed!',
                        // data: doctors
                  })
            } catch (e) {
                  reject(e);
            }
      })
}

let DetailDoctorById = (inputId) => {
      return new Promise(async (resolve, reject) => {
            try {
                  if (!inputId) {
                        resolve({
                              errCode: 1,
                              message: 'Missing required parameters!'
                        })
                  } else {
                        let data = await db.User.findOne({
                              where: { id: inputId },
                              attributes: {
                                    exclude: ['password']
                              },
                              include: [
                                    { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] }
                              ],
                              raw: false,
                              nest: true
                        })
                        if (data && data.image) {
                              data.image = new Buffer.from(data.image, 'base64').toString('binary');
                        }
                        if (!data) {
                              data = {};
                        }
                        resolve({
                              errCode: 0,
                              data: data
                        })
                  }
            } catch (e) {
                  reject(e);
            }
      })
}

module.exports = {
      getTopDoctorHome: getTopDoctorHome,
      getAllDoctors: getAllDoctors,
      saveDetailInfoDoctor: saveDetailInfoDoctor,
      getDetailDoctorById: DetailDoctorById
}