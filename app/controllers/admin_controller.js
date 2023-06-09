const express = require("express");
const HTTP = require("../../constants/responseCode.constant");
const Register = require("../models/register");
const admin_agent = require("../models/admin.agent");
const property_listing = require("../models/property_listing");
const { log } = require("handlebars");
const { array } = require("../middlewares/agent.upload");
const bcrypt = require("bcrypt");
const { hashSync } = require("bcrypt");
const fs = require("fs");
const path = require("path");

async function TotalCount(req, res) {
    try {
        if (req.Data) {
            var agency_data = await Register.find({ role: 'agency' });
            var agent_data = await admin_agent.find({ role: 'agent' });
            var property_data = await property_listing.find({ role: 'property' });
            var user_data = await Register.find({ role: 'user' });

            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Total Count", 'agency': agency_data.length, 'agent': agent_data.length, 'property': property_data.length, 'user': user_data.length });
        }
        else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
};

async function ViewAllAgency(req, res) {
    try {
        var data = [];
        if (req.Data) {
            var agency_data = await Register.find({ role: 'agency' });
            for (data_s of agency_data) {
                data.push({
                    id: data_s.id,
                    principal_name: data_s.principal_name,
                    display_email: data_s.email,
                    agencyLargeLogo: data_s.agencyLargeLogo
                })
            }

            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Agency details.", data: data });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: data });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
};

async function ViewAllAgent(req, res) {
    try {
        if (req.Data) {
            var agent_data = await admin_agent.find({ role: 'agent' });
            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "agent details.", data: agent_data });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}


async function ViewAllproperty(req, res) {
    try {
        if (req.Data) {
            var property_data = await property_listing.find({ role: 'property' });
            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Agency details.", data: property_data });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}


async function Create(req, res) {
    try {
        if (req.Data) {
            const password = hashSync(req.body.password.trim(), 8)
            let { email,
                role,
                street,
                suburb_area,
                postcode,
                state_region,
                country,
                mailing_address_street,
                mailing_address_suburb_area,
                mailing_address_postcode,
                mailing_address_state_region,
                mailing_address_country,
                fax,
                phone,
                web,
                facebook_page,
                twitter_profile_url,
                principal_name,
                display_email,
                office_description,
                primary_color,
                secondary_color,
                text_color
            } = req.body

            // if (!street || !suburb_area || !postcode || !state_region || !country || !phone || !display_email) {
            //     return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.NOT_FOUND, "message": "All fields are required!", data: {} })
            // }

            // if (!email.includes('@')) {
            //     return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "email is invalid!", data: {} })
            // }

            // if (postcode.length < 5 || postcode.length >= 12) {
            //     return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "Please enter a strong password", data: {} })
            // }

            // const userExists = await Register.findOne({ $or: [{ email: req.body.email }] })
            // if (userExists) return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.BAD_REQUEST, "message": "User Exists. Please Sign In.", data: {} })

            // let { agencySmallLogo, agencyMediumLogo, agencyLargeLogo, commercialAgencySmallLogo, commercialAgencyMediumLogo, commercialAgencyLargeLogo, commercialAgencyExtraLargeLogo, heroImg } = req.files;



            for (data of req.files.agencySmallLogo) {
                var agencySmallLogo = "uploads/agency_image/" + data.filename;
            }

            for (data of req.files.agencyMediumLogo) {
                var agencyMediumLogo = "uploads/agency_image/" + data.filename;
            }

            for (data of req.files.agencyLargeLogo) {
                var agencyLargeLogo = "uploads/agency_image/" + data.filename;
            }

            for (data of req.files.commercialAgencySmallLogo) {
                var commercialAgencySmallLogo = "uploads/agency_image/" + data.filename;
            }

            for (data of req.files.commercialAgencyMediumLogo) {
                var commercialAgencyMediumLogo = "uploads/agency_image/" + data.filename;
            }

            for (data of req.files.commercialAgencyLargeLogo) {
                var commercialAgencyLargeLogo = "uploads/agency_image/" + data.filename;
            }

            for (data of req.files.commercialAgencyExtraLargeLogo) {
                var commercialAgencyExtraLargeLogo = "uploads/agency_image/" + data.filename;
            }

            for (data of req.files.heroImg) {
                var heroImg = "uploads/agency_image/" + data.filename;
            }

            await new Register({
                email,
                password,
                role,
                street,
                suburb_area,
                postcode,
                state_region,
                country,
                mailing_address_street,
                mailing_address_suburb_area,
                mailing_address_postcode,
                mailing_address_state_region,
                mailing_address_country,
                fax,
                phone,
                web,
                facebook_page,
                twitter_profile_url,
                principal_name,
                display_email,
                office_description,
                agencySmallLogo,
                agencyMediumLogo,
                agencyLargeLogo,
                commercialAgencySmallLogo,
                commercialAgencyMediumLogo,
                commercialAgencyLargeLogo,
                commercialAgencyExtraLargeLogo,
                heroImg,
                primary_color,
                secondary_color,
                text_color
            }).save()
            return res.status(HTTP.SUCCESS).send({ "status": true, 'code': HTTP.SUCCESS, "message": "agency register.", data: {} })
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }

    } catch (e) {
        console.log(e)
        return res.status(HTTP.SUCCESS).send({ "status": false, 'code': HTTP.INTERNAL_SERVER_ERROR, "message": "Something went wrong!", data: {} })
    }
}

async function publishUpdate(req, res) {
    try {
        if (req.Data) {
            var id = req.params.id;
            await Register.findByIdAndUpdate(id, { publish: true });
            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Agency details.", data: {} });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}

async function AgencyEdit(req, res) {
    try {
        var id = req.params.id;
        let { email,
            street,
            suburb_area,
            postcode,
            state_region,
            country,
            mailing_address_street,
            mailing_address_suburb_area,
            mailing_address_postcode,
            mailing_address_state_region,
            mailing_address_country,
            fax,
            phone,
            web,
            facebook_page,
            twitter_profile_url,
            principal_name,
            display_email,
            office_description,
            primary_color,
            secondary_color,
            text_color
        } = req.body;

        let { agencySmallLogo, agencyMediumLogo, agencyLargeLogo, commercialAgencySmallLogo, commercialAgencyMediumLogo, commercialAgencyLargeLogo, commercialAgencyExtraLargeLogo, heroImg } = req.files;

        if (req.Data) {
            if (!req.files) {
                await Register.findByIdAndUpdate(id, {
                    email,
                    street,
                    suburb_area,
                    postcode,
                    state_region,
                    country,
                    mailing_address_street,
                    mailing_address_suburb_area,
                    mailing_address_postcode,
                    mailing_address_state_region,
                    mailing_address_country,
                    fax,
                    phone,
                    web,
                    facebook_page,
                    twitter_profile_url,
                    principal_name,
                    display_email,
                    office_description,
                    primary_color,
                    secondary_color,
                    text_color
                }, { new: true });
                console.log(" ---------------- No Image --------------->");

            } else {
                await Register.findByIdAndUpdate(id, {
                    email,
                    street,
                    suburb_area,
                    postcode,
                    state_region,
                    country,
                    mailing_address_street,
                    mailing_address_suburb_area,
                    mailing_address_postcode,
                    mailing_address_state_region,
                    mailing_address_country,
                    fax,
                    phone,
                    web,
                    facebook_page,
                    twitter_profile_url,
                    principal_name,
                    display_email,
                    office_description,
                    primary_color,
                    secondary_color,
                    text_color
                }, { new: true });
                console.log("----------------- With Img --------------->");

                await Register.findById(id, async function (err, doc) {
                    if (req.files.agencySmallLogo) {
                        if (req.files.agencySmallLogo !== null) {
                            console.log(doc, "-------------------->");
                            if (doc.agencySmallLogo) {
                                fs.unlinkSync(path.join(__dirname, "..", "..", doc.agencySmallLogo)
                                );
                            }
                            for (data of req.files.agencySmallLogo) {
                                agencySmallLogo = "uploads/agency_image/" + data.filename;
                                console.log("🚀 ~ file: blog.controller.js:556 ~ editBlog ~ outsideImg", agencySmallLogo);
                                await Register.findByIdAndUpdate(id, { agencySmallLogo: agencySmallLogo }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        } else {
                            console.log(doc, "--------------------><------------------------");
                            var imagePath = "";
                            if (doc.agencySmallLogo) {
                                imagePath = doc.agencySmallLogo;
                            }
                            for (data of req.files.agencySmallLogo) {
                                await Register.findByIdAndUpdate(id, { agencySmallLogo: imagePath }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        }
                    }
                    if (req.files.agencyMediumLogo) {
                        if (req.files.agencyMediumLogo !== null) {
                            console.log(doc.agencySmallLogo, "-------------------->123");
                            if (doc.agencyMediumLogo) {
                                fs.unlinkSync(
                                    path.join(__dirname, "..", "..", doc.agencyMediumLogo)
                                );
                            }
                            for (data of req.files.agencyMediumLogo) {
                                agencyMediumLogo = "uploads/agency_image/" + data.filename;
                                console.log("🚀 ~ file: blog.controller.js:589 ~ editBlog ~ outsideImg", agencyMediumLogo);
                                await Register.findByIdAndUpdate(id, { agencyMediumLogo: agencyMediumLogo }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        } else {
                            console.log(doc, "--------------------><--------------------");
                            var imagePath = "";
                            if (doc.agencyMediumLogo) {
                                imagePath = doc.agencyMediumLogo;
                            }
                            for (data of req.files.agencyMediumLogo) {
                                await Register.findByIdAndUpdate(id, { agencyMediumLogo: imagePath }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        }
                    }

                    if (req.files.agencyLargeLogo) {
                        if (req.files.agencyLargeLogo !== null) {
                            console.log(doc, "-------------------->");
                            if (doc.agencyLargeLogo) {
                                fs.unlinkSync(path.join(__dirname, "..", "..", doc.agencyLargeLogo)
                                );
                            }
                            for (data of req.files.agencyLargeLogo) {
                                agencyLargeLogo = "uploads/agency_image/" + data.filename;
                                console.log("🚀 ~ file: blog.controller.js:621 ~ editBlog ~ outsideImg", agencyLargeLogo);
                                await Register.findByIdAndUpdate(id, { agencyLargeLogo: agencyLargeLogo }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        } else {
                            console.log(doc, "-------------------->");
                            var imagePath = "";
                            if (doc.agencyLargeLogo) {
                                imagePath = doc.agencyLargeLogo;
                            }
                            for (data of req.files.agencyLargeLogo) {
                                await Register.findByIdAndUpdate(id, { agencyLargeLogo: imagePath }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        }
                    }
                    if (req.files.commercialAgencySmallLogo) {
                        if (req.files.commercialAgencySmallLogo !== null) {
                            console.log(doc, "-------------------->");
                            if (doc.commercialAgencySmallLogo) {
                                fs.unlinkSync(path.join(__dirname, "..", "..", doc.commercialAgencySmallLogo));
                            }
                            for (data of req.files.commercialAgencySmallLogo) {
                                commercialAgencySmallLogo = "uploads/agency_image/" + data.filename;
                                await Register.findByIdAndUpdate(id, { commercialAgencySmallLogo: commercialAgencySmallLogo }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        } else {
                            console.log(doc, "-------------------->");
                            var imagePath = "";
                            if (doc.commercialAgencySmallLogo) {
                                imagePath = doc.commercialAgencySmallLogo;
                            }
                            for (data of req.files.commercialAgencySmallLogo) {
                                await Register.findByIdAndUpdate(id, { commercialAgencySmallLogo: imagePath }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        }
                    }
                    if (req.files.commercialAgencyMediumLogo) {
                        if (req.files.commercialAgencyMediumLogo !== null) {
                            console.log(doc, "-------------------->");
                            if (doc.commercialAgencyMediumLogo) {
                                fs.unlinkSync(path.join(__dirname, "..", "..", doc.commercialAgencyMediumLogo));
                            }
                            for (data of req.files.commercialAgencyMediumLogo) {
                                commercialAgencyMediumLogo = "uploads/agency_image/" + data.filename;
                                await Register.findByIdAndUpdate(id, { commercialAgencyMediumLogo: commercialAgencyMediumLogo }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        } else {
                            console.log(doc, "-------------------->");
                            var imagePath = "";
                            if (doc.commercialAgencyMediumLogo) {
                                imagePath = doc.commercialAgencyMediumLogo;
                            }
                            for (data of req.files.commercialAgencyMediumLogo) {
                                await Register.findByIdAndUpdate(id, { commercialAgencyMediumLogo: imagePath }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        }
                    }
                    if (req.files.commercialAgencyLargeLogo) {
                        if (req.files.commercialAgencyLargeLogo !== null) {
                            console.log(doc, "-------------------->");
                            if (doc.commercialAgencyLargeLogo) {
                                fs.unlinkSync(path.join(__dirname, "..", "..", doc.commercialAgencyLargeLogo));
                            }
                            for (data of req.files.commercialAgencyLargeLogo) {
                                commercialAgencyLargeLogo = "uploads/agency_image/" + data.filename;
                                await Register.findByIdAndUpdate(id, { commercialAgencyLargeLogo: commercialAgencyLargeLogo }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        } else {
                            console.log(doc, "-------------------->");
                            var imagePath = "";
                            if (doc.commercialAgencyLargeLogo) {
                                imagePath = doc.commercialAgencyLargeLogo;
                            }
                            for (data of req.files.commercialAgencyLargeLogo) {
                                await Register.findByIdAndUpdate(id, { commercialAgencyLargeLogo: imagePath }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        }
                    }
                    if (req.files.commercialAgencyExtraLargeLogo) {
                        if (req.files.commercialAgencyExtraLargeLogo !== null) {
                            console.log(doc, "-------------------->");
                            if (doc.commercialAgencyExtraLargeLogo) {
                                fs.unlinkSync(path.join(__dirname, "..", "..", doc.commercialAgencyExtraLargeLogo));
                            }
                            for (data of req.files.commercialAgencyExtraLargeLogo) {
                                commercialAgencyExtraLargeLogo = "uploads/agency_image/" + data.filename;
                                await Register.findByIdAndUpdate(id, { commercialAgencyExtraLargeLogo: commercialAgencyExtraLargeLogo }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        } else {
                            console.log(doc, "-------------------->");
                            var imagePath = "";
                            if (doc.commercialAgencyExtraLargeLogo) {
                                imagePath = doc.commercialAgencyExtraLargeLogo;
                            }
                            for (data of req.files.commercialAgencyExtraLargeLogo) {
                                await Register.findByIdAndUpdate(id, { commercialAgencyExtraLargeLogo: imagePath }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        }
                    }
                    if (req.files.heroImg) {
                        if (req.files.heroImg !== null) {
                            console.log(doc, "-------------------->");
                            if (doc.heroImg) {
                                fs.unlinkSync(path.join(__dirname, "..", "..", doc.heroImg));
                            }
                            for (data of req.files.heroImg) {
                                heroImg = "uploads/agency_image/" + data.filename;
                                await Register.findByIdAndUpdate(id, { heroImg: heroImg }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        } else {
                            console.log(doc, "-------------------->");
                            var imagePath = "";
                            if (doc.heroImg) {
                                imagePath = doc.heroImg;
                            }
                            for (data of req.files.heroImg) {
                                await Register.findByIdAndUpdate(id, { heroImg: imagePath }, { new: true }), function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                            }
                        }
                    }
                    return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Agent registered.", data: {} });
                }).clone();
            }
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}

async function AgencyDelete(req, res) {
    try {
        if (req.Data) {
            var id = req.params.id;
            await Register.findByIdAndDelete(id, {});
            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Agency delete", data: {} });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}

async function ViewAgencyByid(req, res) {
    try {
        var id = req.params.id;
        if (req.Data) {
            var agency_data = await Register.findById(id, {});
            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Agency details.", data: agency_data });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: data });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }

}

async function ViewAgencyOfproperty(req, res) {
    try {
        var id = req.params.id;
        if (req.Data) {
            var property_data = await property_listing.find({ agency_id: id });
            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Agency delete", data: property_data });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}

// async function Agent(req, res) {
//     try {
//         // console.log(req.params.id);
//         var id = req.params.id;
//         if (req.Data) {
//             var agent_data = await admin_agent.find({ _id: id });
//             return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Agency delete", data: agent_data });
//         } else {
//             return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
//     }
// }

async function AgentCreate(req, res) {
    try {
        let {
            agency_id,
            job_title,
            email,
            confirm_email,
            mobile_number,
            business_number,
            first_name,
            last_name,
            start_year_in_industry,
            license_number,
            about_me,
            taglines,
            awards,
            specialties,
            community_involvement,
            video_title,
            video_URL,
            twitter_profile_URL,
            facebook_profile_URL,
            linkedIn_profile_URL,
            role,
            residential_sales,
            residential_property_management,
            weakly_update,
            reviews
        } = req.body;


        let { profileImg, coverProfileImg } = req.files;

        // if(!req.agency_id){
        //     return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "agency_id " });
        // }

        var name = first_name + " " + last_name;

        if (email !== confirm_email)
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "Email and confirm email does not match" });

        var img_data = req.files.profileImg;
        var imgSecond_data = req.files.coverProfileImg;

        for (data of img_data) { }
        var pro = "uploads/agent" + data.filename;
        for (datas of imgSecond_data) { }
        var co = "uploads/agent" + datas.filename;

        console.log(pro, "------", co);

        // var photo = req.files.profileImg.find((item) => item);
        // var profileImg = "uploads/agent" + photo.filename;

        // var profile = req.files.coverProfileImg.find((item) => item);
        // var coverProfileImg = "uploads/agent" + profile.filename;

        if (!start_year_in_industry || !license_number) {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.NOT_FOUND, message: "All fields are required!", data: {} });
        }

        if (!email.includes("@")) {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "email is invalid!", data: {} });
        }

        const userExists = await admin_agent.findOne({ $or: [{ email: req.body.email }] });
        if (userExists)
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, message: "Agent with this email is already exist", data: {} });

        console.log(req.Data, " ----------------------------------------");

        var agencyId_Data = req.Data;
        console.log(agencyId_Data, "------------ line:- 929---------------------->");

        console.log(req.body)


        // var logo = await Register.findById(req.Data, {});
        // var logo_data = logo.agencySmallLogo;

        await new admin_agent({
            job_title,
            email,
            confirm_email,
            mobile_number,
            business_number,
            profileImg: pro,
            first_name,
            last_name,
            name,
            start_year_in_industry,
            license_number,
            about_me,
            taglines,
            awards,
            specialties,
            community_involvement,
            coverProfileImg: co,
            video_title,
            video_URL,
            twitter_profile_URL,
            facebook_profile_URL,
            linkedIn_profile_URL,
            role,
            residential_sales,
            residential_property_management,
            weakly_update,
            Admin_id: agencyId_Data,
            reviews
        }).save();

        return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Agent registered.", });
    } catch (e) {
        console.log(e);
        return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}

async function agentDelete(req, res) {
    try {
        var id = req.params.id;
        if (req.Data) {
            await admin_agent.findByIdAndDelete(id, {});
            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Agent delete" });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}

async function agentView(req, res) {
    try {
        // console.log(req.params.id);
        var id = req.params.id;
        if (req.Data) {
            var agent_data = await admin_agent.findById(id, {}, { new: true });
            console.log(agent_data);
            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Agent view", data: agent_data });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}

async function agentEdit(req, res) {
    try {
        var id = req.params.id;
        if (req.Data) {
            if (!req.files) {
                await admin_agent.findByIdAndUpdate(id, { $set: req.body }, { new: true });
                return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "agent update" });
            } else {
                await admin_agent.findByIdAndUpdate(id, { $set: req.body }, { new: true });

                const doc = await admin_agent.findById(id, {}, { new: true });

                if (req.files.profileImg) {
                    if (req.files.profileImg !== null) {
                        // console.log(doc, "-------------------->");
                        if (doc.profileImg) {
                            fs.unlinkSync(path.join(__dirname, "..", "..", doc.profileImg));
                        }
                        for (data of req.files.profileImg) {
                            profileImg = "uploads/agent" + data.filename;
                            console.log(
                                "🚀 ~ file: blog.controller.js:556 ~ editBlog ~ outsideImg",
                                profileImg
                            );
                            await admin_agent.findByIdAndUpdate(
                                id,
                                { profileImg },
                                { new: true }
                            ),
                                function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                        }
                    } else {
                        //console.log(doc, "--------------------><------------------------");
                        var imagePath = "";
                        if (doc.profileImg) {
                            imagePath = doc.profileImg;
                        }
                        for (data of req.files.profileImg) {
                            await admin_agent.findByIdAndUpdate(
                                id,
                                { profileImg: imagePath },
                                { new: true }
                            ),
                                function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                        }
                    }
                }
                if (req.files.coverProfileImg) {
                    if (req.files.coverProfileImg !== null) {
                        console.log(doc.coverProfileImg, "-------------------->123");
                        if (doc.coverProfileImg) {
                            fs.unlinkSync(
                                path.join(__dirname, "..", "..", doc.coverProfileImg)
                            );
                        }
                        for (data of req.files.coverProfileImg) {
                            coverProfileImg = "uploads/agent" + data.filename;
                            console.log(
                                "🚀 ~ file: blog.controller.js:589 ~ editBlog ~ outsideImg",
                                coverProfileImg
                            );
                            await admin_agent.findByIdAndUpdate(
                                id,
                                { coverProfileImg: coverProfileImg },
                                { new: true }
                            ),
                                function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                        }
                    } else {
                        // console.log(doc, "--------------------><--------------------");
                        var imagePath = "";
                        if (doc.coverProfileImg) {
                            imagePath = doc.coverProfileImg;
                        }
                        for (data of req.files.coverProfileImg) {
                            await admin_agent.findByIdAndUpdate(
                                id,
                                { coverProfileImg: imagePath },
                                { new: true }
                            ),
                                function (err, docs) {
                                    if (err) {
                                        console.log(err);
                                    }
                                };
                        }
                    }
                }

                return res.status(HTTP.SUCCESS).send({
                    status: true,
                    code: HTTP.SUCCESS,
                    message: "Agent updated.",
                    data: {},
                });


                // return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "agent update" });

            }
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}

async function ListingCreate(req, res) {
    try {
        if (req.Data) {
            let {
                listing_type,
                property_type,
                status,
                new_or_established_checked,
                lead_agent,
                authority,
                price,
                price_display,
                price_display_checked,
                name,
                email,
                phone_number,
                unit,
                street_address_number,
                street_address_name,
                suburb,
                municipality,
                auction_result,
                maximum_bid,
                Bedrooms,
                Bathrooms,
                Ensuites,
                toilets,
                garage_spaces,
                carport_spaces,
                open_spaces,
                energy_efficiensy_rating,
                living_areas,
                house_size,
                house_size_square,
                land_size,
                land_size_square,
                other_features,

                established_property,
                new_construction,
                show_actual_price,
                show_text_instead_of_price,
                Hide_the_price_and_display_contact_agent,
                send_vendor_the_property_live_email_when_listing_is_published,
                send_vendor_a_weekly_campaign_activity_report_email,
                hide_street_address_on_listing,
                hide_street_view,

                outdoor_deck,
                outdoor_swimming_pool_in_ground,
                outdoor_swimming_pool_above_ground,
                outdoor_tennis_court,
                outdoor_fully_fenced,
                outdoor_shed,
                outdoor_outside_spa,
                outdoor_outdoor_entertainment_area,
                outdoor_secure_parking,
                outdoor_courtyard,
                outdoor_remote_garage,
                outdoor_garage,
                outdoor_balcony,
                indoor_alaram_system,
                indoor_study,
                indoor_workshop,
                indoor_gym,
                indoor_built_in_wardrodes,
                indoor_intercom,
                indoor_ducted_vacuum_system,
                indoor_rumpus_room,
                indoor_inside_spa,
                indoor_floorboards,
                indoor_dishwashera,
                indoor_play_tv_access,
                indoor_broadband_internet_available,
                hc_air_conditioning,
                hc_ducted_heating,
                hc_hydronic_heating,
                hc_ducted_cooling,
                hc_gas_heating,
                hc_open_fireplace,
                hc_split_system_air_conditioning,
                hc_split_system_heating,
                hc_evaporative_cooling,
                hc_reverse_cycle_air_conditioning,
                eff_solar_hot_water,
                eff_water_tank,
                eff_grey_water_system,
                eff_solar_panels,
                cces_air_conditionings,
                cces_solar_hot_water,
                cces_high_energy_efficieny,
                cces_solar_panels,
                cces_heating,
                cces_water_tank,
                heading,
                discription,
                video_url,
                online_tour_1,
                online_tour_2,
                agency_listing_url,
                inspection_times,
            } = req.body;

            // inspection_times = JSON.parse(inspection_times);

            var { propertyImg, florePlansImg, frontPageImg, statementOfInfo } = req.files;

            if (!propertyImg || !florePlansImg || !statementOfInfo || !frontPageImg) {
                return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.NOT_ALLOWED, message: "upload All Images and File", data: {} });
            }

            if (!Bedrooms || !Bathrooms || !property_type || !new_or_established_checked || !lead_agent || !price) {
                return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.NOT_FOUND, message: "All fields are required!", data: {} });
            }
            console.log(
                req.files.propertyImg, "<<<<<<<<<<<-----------------------------------");

            console.log(req.files, "---------------------------------------->>>>>>>>");
            lead_agent = JSON.parse(lead_agent)
            // inspection_times = JSON.parse(inspection_times);

            var propertyImg = [];

            for (const data of req.files.propertyImg) {
                propertyImg.push("uploads/property_image" + data.filename);
            }

            console.log(propertyImg, "-------------------------------- array of property images -----------------------------------------");


            console.log("=======================>>>>", propertyImg);

            var plan = req.files.florePlansImg.find((item) => item);
            var florePlansImg = "uploads/property_image" + plan.filename;

            var statement = req.files.statementOfInfo.find((item) => item);
            var statementOfInfo = "uploads/property_image" + statement.filename;

            var frontPage = req.files.frontPageImg.find((item) => item);
            var frontPageImg = "uploads/property_image" + frontPage.filename;

            var agencyId_Data = req.Data;


            await new property_listing({
                agency_id: req.Data,
                listing_type,
                property_type,
                status,
                new_or_established_checked,
                lead_agent,
                authority,
                price,
                price_display,
                price_display_checked,
                name,
                email,
                phone_number,
                unit,
                street_address_number,
                street_address_name,
                suburb,
                municipality,
                auction_result,
                maximum_bid,
                Bedrooms,
                Bathrooms,
                Ensuites,
                toilets,
                garage_spaces,
                carport_spaces,
                open_spaces,
                energy_efficiensy_rating,
                living_areas,
                house_size,
                house_size_square,
                land_size,
                land_size_square,
                other_features,

                established_property,
                new_construction,
                show_actual_price,
                show_text_instead_of_price,
                Hide_the_price_and_display_contact_agent,
                send_vendor_the_property_live_email_when_listing_is_published,
                send_vendor_a_weekly_campaign_activity_report_email,
                hide_street_address_on_listing,
                hide_street_view,

                outdoor_deck,
                outdoor_swimming_pool_in_ground,
                outdoor_swimming_pool_above_ground,
                outdoor_tennis_court,
                outdoor_fully_fenced,
                outdoor_shed,
                outdoor_outside_spa,
                outdoor_outdoor_entertainment_area,
                outdoor_secure_parking,
                outdoor_courtyard,
                outdoor_remote_garage,
                outdoor_garage,
                outdoor_balcony,
                indoor_alaram_system,
                indoor_study,
                indoor_workshop,
                indoor_gym,
                indoor_built_in_wardrodes,
                indoor_intercom,
                indoor_ducted_vacuum_system,
                indoor_rumpus_room,
                indoor_inside_spa,
                indoor_floorboards,
                indoor_dishwashera,
                indoor_play_tv_access,
                indoor_broadband_internet_available,
                hc_air_conditioning,
                hc_ducted_heating,
                hc_hydronic_heating,
                hc_ducted_cooling,
                hc_gas_heating,
                hc_open_fireplace,
                hc_split_system_air_conditioning,
                hc_split_system_heating,
                hc_evaporative_cooling,
                hc_reverse_cycle_air_conditioning,
                eff_solar_hot_water,
                eff_water_tank,
                eff_grey_water_system,
                eff_solar_panels,
                cces_air_conditionings,
                cces_solar_hot_water,
                cces_high_energy_efficieny,
                cces_solar_panels,
                cces_heating,
                cces_water_tank,
                heading,
                discription,
                video_url,
                online_tour_1,
                online_tour_2,
                agency_listing_url,
                inspection_times, propertyImg, florePlansImg, frontPageImg, statementOfInfo
            }).save();

            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Property listed successfully", data: {} });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}

async function listingView(req, res) {
    try {
        var id = req.params.id;
        if (req.Data) {
            var property_data = await property_listing.findById({ _id: id });
            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "property View", data: property_data });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}

async function Listingedit(req, res) {
    try {
        if (req.Data) {
            var id = req.params.id;
            let {
                property_type,
                listing_type,
                status,
                new_or_established_checked,
                lead_agent,
                authority,
                price,
                price_display,
                price_display_checked,
                name,
                email,
                phone_number,
                unit,
                street_address_number,
                street_address_name,
                suburb,
                municipality,
                auction_result,
                maximum_bid,
                Bedrooms,
                Bathrooms,
                Ensuites,
                toilets,
                garage_spaces,
                carport_spaces,
                open_spaces,
                energy_efficiensy_rating,
                living_areas,
                house_size,
                house_size_square,
                land_size,
                land_size_square,
                other_features,

                established_property,
                new_construction,
                show_actual_price,
                show_text_instead_of_price,
                Hide_the_price_and_display_contact_agent,
                send_vendor_the_property_live_email_when_listing_is_published,
                send_vendor_a_weekly_campaign_activity_report_email,
                hide_street_address_on_listing,
                hide_street_view,

                outdoor_deck,
                outdoor_swimming_pool_in_ground,
                outdoor_swimming_pool_above_ground,
                outdoor_tennis_court,
                outdoor_fully_fenced,
                outdoor_shed,
                outdoor_outside_spa,
                outdoor_outdoor_entertainment_area,
                outdoor_secure_parking,
                outdoor_courtyard,
                outdoor_remote_garage,
                outdoor_garage,
                outdoor_balcony,
                indoor_alaram_system,
                indoor_study,
                indoor_workshop,
                indoor_gym,
                indoor_built_in_wardrodes,
                indoor_intercom,
                indoor_ducted_vacuum_system,
                indoor_rumpus_room,
                indoor_inside_spa,
                indoor_floorboards,
                indoor_dishwashera,
                indoor_play_tv_access,
                indoor_broadband_internet_available,
                hc_air_conditioning,
                hc_ducted_heating,
                hc_hydronic_heating,
                hc_ducted_cooling,
                hc_gas_heating,
                hc_open_fireplace,
                hc_split_system_air_conditioning,
                hc_split_system_heating,
                hc_evaporative_cooling,
                hc_reverse_cycle_air_conditioning,
                eff_solar_hot_water,
                eff_water_tank,
                eff_grey_water_system,
                eff_solar_panels,
                cces_air_conditionings,
                cces_solar_hot_water,
                cces_high_energy_efficieny,
                cces_solar_panels,
                cces_heating,
                cces_water_tank,
                heading,
                discription,
                video_url,
                online_tour_1,
                online_tour_2,
                agency_listing_url,
                inspection_times,
            } = req.body;

            let { propertyImg, florePlansImg, statementOfInfo, frontPageImg } = req.files
            // var data_id = await property_listing.findOne({ agency_id: req.Data });




            if (req.files != [] || req.files != undefined) {

                var arrayData = [];
                // console.log(typeof data);

                // for (var i of data) {
                //   arrayData.push("uploads/property_image" + i.filename);
                // }

                // plan = req.files.florePlansImg.find((item) => item);
                // florePlansImg = "uploads/property_image" + plan.filename;

                // statement = req.files.statementOfInfo.find((item) => item);
                // statementOfInfo = "uploads/property_image" + statement.filename;

                // frontPage = req.files.frontPageImg.find((item) => item);
                // frontPageImg = "uploads/property_image" + frontPage.filename;

                var doc = await property_listing.findById(id, {});

                var arr = [];
                arr.push(doc);

                for (da of arr) {
                    // console.log(da._id);
                }

                var first = da.propertyImg;
                var second = doc.florePlansImg;
                var third = doc.statementOfInfo;
                var fourth = doc.frontPageImg;

                var firsts = [first];
                var seconds = [second];
                var thirds = [third];
                var fourths = [fourth];

                // console.log(firsts, "-------------------- array data [ 624 ]-----------------");

                // var firstsData = firsts.toString();
                var secondsData = seconds.toString();
                var thirdsData = thirds.toString();
                var fourthsData = fourths.toString();

                // console.log(firstsData, " ================== String data [ 631 ] =================");

                for (property of firsts) {
                    // console.log(property);
                }

                for (pro of property) {
                    // console.log(pro,"===============> final data");
                }


                if (req.files.propertyImg != undefined) {

                    //  console.log(
                    //    "====== maro log ===================)))",
                    //    URL.createObjectURL(propertyImg)
                    //  );
                    for (const data of req.files.propertyImg) {
                        outsideImg = "uploads/property_image" + data.filename;
                        console.log("🚀 ~ file: propertyImg.controller.js:646 ~ editBlog ~ outsideImg ----------------------------------------------------------->", outsideImg)

                        if (outsideImg) {
                            propertyImg = "uploads/property_image" + data.filename;
                            // fs.unlinkSync(path.join(__dirname, "..", "..", pro))

                        }
                        const data_ = await property_listing.findByIdAndUpdate(id, { propertyImg: outsideImg }, { new: true })
                        if (!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })
                    }
                }

                if (req.files.florePlansImg != undefined) {
                    for (const data of req.files.florePlansImg) {
                        florePlansImg = "uploads/property_image" + data.filename;
                        // console.log("🚀 ~ file: blog.controller.js:642 ~ editBlog ~ outsideImg", florePlansImg)

                        if (secondsData) {
                            secondsData = "uploads/property_image" + data.filename;
                            // console.log("🚀 ~ file: blog.controller.js:118 ~ editBlog ~ filename_", filename_)
                            fs.unlinkSync(path.join(__dirname, "..", "..", secondsData));
                        }
                        const data_ = await property_listing.findByIdAndUpdate(id, { florePlansImg }, { new: true })
                        if (!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })
                    }
                }

                if (req.files.statementOfInfo != undefined) {
                    for (const data of req.files.statementOfInfo) {
                        statementOfInfo = "uploads/property_image" + data.filename;
                        // console.log("🚀 ~ file: blog.controller.js:657 ~ editBlog ~ outsideImg", statementOfInfo)

                        if (thirdsData) {
                            thirdsData = "uploads/property_image" + data.filename;
                            // console.log("🚀 ~ file: blog.controller.js:118 ~ editBlog ~ filename_", filename_)
                            fs.unlinkSync(path.join(__dirname, "..", "..", fourthsData));
                        }
                        const data_ = await property_listing.findByIdAndUpdate(id, { statementOfInfo }, { new: true })
                        if (!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })
                    }
                }

                if (req.files.frontPageImg != undefined) {
                    console.log(req.files.frontPageImg, "----------------------->");
                    for (const data of req.files.frontPageImg) {
                        var frontimg = "uploads/property_image" + data.filename;
                        // console.log("🚀 ~ file: blog.controller.js:672 ~ editBlog ~ outsideImg", frontPageImg)
                    }
                    if (fourthsData) {
                        // var fourthsData = "uploads/property_image" + filename;
                        // console.log("🚀 ~ file: blog.controller.js:118 ~ editBlog ~ filename_", filename_)
                        fs.unlinkSync(path.join(__dirname, "..", "..", fourthsData));
                    }
                    const data_ = await property_listing.findByIdAndUpdate(id, { frontPageImg: frontimg }, { new: true })
                    if (!data_) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.BAD_REQUEST, 'message': 'Unable to update data!', data: {} })

                }


                const updateData = await property_listing.findByIdAndUpdate(id, {
                    property_type,
                    listing_type,
                    status,
                    new_or_established_checked,
                    lead_agent,
                    authority,
                    price,
                    price_display,
                    price_display_checked,
                    name,
                    email,
                    phone_number,
                    unit,
                    street_address_number,
                    street_address_name,
                    suburb,
                    municipality,
                    auction_result,
                    maximum_bid,
                    Bedrooms,
                    Bathrooms,
                    Ensuites,
                    toilets,
                    garage_spaces,
                    carport_spaces,
                    open_spaces,
                    energy_efficiensy_rating,
                    living_areas,
                    house_size,
                    house_size_square,
                    land_size,
                    land_size_square,
                    other_features,

                    established_property,
                    new_construction,
                    show_actual_price,
                    show_text_instead_of_price,
                    Hide_the_price_and_display_contact_agent,
                    send_vendor_the_property_live_email_when_listing_is_published,
                    send_vendor_a_weekly_campaign_activity_report_email,
                    hide_street_address_on_listing,
                    hide_street_view,

                    outdoor_deck,
                    outdoor_swimming_pool_in_ground,
                    outdoor_swimming_pool_above_ground,
                    outdoor_tennis_court,
                    outdoor_fully_fenced,
                    outdoor_shed,
                    outdoor_outside_spa,
                    outdoor_outdoor_entertainment_area,
                    outdoor_secure_parking,
                    outdoor_courtyard,
                    outdoor_remote_garage,
                    outdoor_garage,
                    outdoor_balcony,
                    indoor_alaram_system,
                    indoor_study,
                    indoor_workshop,
                    indoor_gym,
                    indoor_built_in_wardrodes,
                    indoor_intercom,
                    indoor_ducted_vacuum_system,
                    indoor_rumpus_room,
                    indoor_inside_spa,
                    indoor_floorboards,
                    indoor_dishwashera,
                    indoor_play_tv_access,
                    indoor_broadband_internet_available,
                    hc_air_conditioning,
                    hc_ducted_heating,
                    hc_hydronic_heating,
                    hc_ducted_cooling,
                    hc_gas_heating,
                    hc_open_fireplace,
                    hc_split_system_air_conditioning,
                    hc_split_system_heating,
                    hc_evaporative_cooling,
                    hc_reverse_cycle_air_conditioning,
                    eff_solar_hot_water,
                    eff_water_tank,
                    eff_grey_water_system,
                    eff_solar_panels,
                    cces_air_conditionings,
                    cces_solar_hot_water,
                    cces_high_energy_efficieny,
                    cces_solar_panels,
                    cces_heating,
                    cces_water_tank,
                    heading,
                    discription,
                    video_url,
                    online_tour_1,
                    online_tour_2,
                    agency_listing_url,
                    inspection_times
                });
                console.log(updateData);
                console.log(updateData.status);

                if (updateData) {
                    return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Profile update", })
                }
                // else {
                //   return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Profile update" })
                // }
            } else {
                await property_listing.findById(id, async function (err, doc) {
                    console.log("hello world");
                    if (!propertyImg || !florePlansImg || !statementOfInfo || !frontPageImg) {
                        let propertyImg = doc.propertyImg;
                        let florePlansImg = doc.florePlansImg;
                        let statementOfInfo = doc.statementOfInfo;
                        let frontPageImg = doc.frontPageImg;

                        property_listing.findByIdAndUpdate(id, {
                            property_type,
                            listing_type,
                            status,
                            new_or_established_checked,
                            lead_agent,
                            authority,
                            price,
                            price_display,
                            price_display_checked,
                            name,
                            email,
                            phone_number,
                            unit,
                            street_address_number,
                            street_address_name,
                            suburb,
                            municipality,
                            auction_result,
                            maximum_bid,
                            Bedrooms,
                            Bathrooms,
                            Ensuites,
                            toilets,
                            garage_spaces,
                            carport_spaces,
                            open_spaces,
                            energy_efficiensy_rating,
                            living_areas,
                            house_size,
                            house_size_square,
                            land_size,
                            land_size_square,
                            other_features,

                            established_property,
                            new_construction,
                            show_actual_price,
                            show_text_instead_of_price,
                            Hide_the_price_and_display_contact_agent,
                            send_vendor_the_property_live_email_when_listing_is_published,
                            send_vendor_a_weekly_campaign_activity_report_email,
                            hide_street_address_on_listing,
                            hide_street_view,

                            outdoor_deck,
                            outdoor_swimming_pool_in_ground,
                            outdoor_swimming_pool_above_ground,
                            outdoor_tennis_court,
                            outdoor_fully_fenced,
                            outdoor_shed,
                            outdoor_outside_spa,
                            outdoor_outdoor_entertainment_area,
                            outdoor_secure_parking,
                            outdoor_courtyard,
                            outdoor_remote_garage,
                            outdoor_garage,
                            outdoor_balcony,
                            indoor_alaram_system,
                            indoor_study,
                            indoor_workshop,
                            indoor_gym,
                            indoor_built_in_wardrodes,
                            indoor_intercom,
                            indoor_ducted_vacuum_system,
                            indoor_rumpus_room,
                            indoor_inside_spa,
                            indoor_floorboards,
                            indoor_dishwashera,
                            indoor_play_tv_access,
                            indoor_broadband_internet_available,
                            hc_air_conditioning,
                            hc_ducted_heating,
                            hc_hydronic_heating,
                            hc_ducted_cooling,
                            hc_gas_heating,
                            hc_open_fireplace,
                            hc_split_system_air_conditioning,
                            hc_split_system_heating,
                            hc_evaporative_cooling,
                            hc_reverse_cycle_air_conditioning,
                            eff_solar_hot_water,
                            eff_water_tank,
                            eff_grey_water_system,
                            eff_solar_panels,
                            cces_air_conditionings,
                            cces_solar_hot_water,
                            cces_high_energy_efficieny,
                            cces_solar_panels,
                            cces_heating,
                            cces_water_tank
                        }), { new: true }, async function (err, docs) {
                            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "Property updated", data: await docs });
                        };
                    }
                });
            }
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}


async function propertyDelete(req, res) {
    try {
        var id = req.params.id;
        if (req.Data) {
            await property_listing.findByIdAndDelete(id, {});
            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "property delete" });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}

async function viewallUser(req, res) {
    try {
        if (req.Data) {
            var User_data = await Register.find({ role: 'user' });
            var arr = [];
            // console.log(User_data);

            for (data of User_data) {
                arr.push({
                    id: data.id,
                    email: data.email,
                    role: data.role
                })
            }

            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "User details.", data: arr });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}

async function Userdelete(req, res) {
    try {
        var id = req.params.id;
        if (req.Data) {
            await Register.findByIdAndDelete(id, {});
            return res.status(HTTP.SUCCESS).send({ status: true, code: HTTP.SUCCESS, message: "User Delete." });
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.UNAUTHORIZED, message: "Please authenticate your-self", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(HTTP.SUCCESS).send({ success: false, code: HTTP.INTERNAL_SERVER_ERROR, message: "Something went wrong!", data: {} });
    }
}

module.exports = {
    TotalCount,
    ViewAllAgency,
    ViewAllAgent,
    ViewAllproperty,
    Create,
    publishUpdate,
    AgencyEdit,
    AgencyDelete,
    ViewAgencyByid,
    ViewAgencyOfproperty,
    // Agent,
    AgentCreate,
    agentDelete,
    agentView,
    agentEdit,
    ListingCreate,
    listingView,
    Listingedit,
    propertyDelete,
    viewallUser,
    Userdelete
};