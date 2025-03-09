import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { _getUser } from '../../api/api';
import Avatar from "../../assets/avatars/below-25-boy.svg"

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  &:hover {
    background: #f9f9f9;
  }
`;

const ProfilePhoto = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const ProfileDetails = styled.div`
  flex: 1;
`;

const ProfileName = styled.div`
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  display: flex;
  justify-Content: center;
`;

const PermissionToggle = styled.button`
  background: ${({ permission }) => (permission === "write" ? "#4CAF50" : "#f44336")};
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
`;

const CollabProfile = ({ collab, handleChangePermission }) => {
    const [permission, setPermission] = useState(collab.role);
    const [user, setUser] = useState(null);
    const imgSrc = useRef("");
    // const [imgSrc, setImgSrc] = useState('');

    const togglePermission = async () => {
        const newPermission = permission === "read" ? "write" : "read";
        const response = await handleChangePermission(collab.userId, newPermission);
        if (response.status === 200) {
            setPermission(newPermission);
        }
        console.log("permission response", response);
    };

    const getUserDetail = async () => {
        try {
            const response = await _getUser(collab.userId);
            const result = await response.json();
            console.log("user", result);
            if (response.status === 200) {
                setUser(result);
            }
        } catch (error) {
            console.error("Failed to fetch user details", error);
        }
    };

    useEffect(() => {
        getUserDetail();
    }, [collab]);

    useEffect(() => {
        if (user?.profilePic) {
            // Since the URL you provided is HTTPS, we can use it directly.
            // imgSrc.current = user.profilePic;
            console.log("current", imgSrc.current);
            // setImgSrc(user.profilePic);
        }
    }, [user]);

    return (
        <ProfileContainer>
            <ProfilePhoto
                src={user?.profilePic}
                alt={`${user?.name}'s photo`}
                onError={(e) => {
                    console.error("Image failed to load:", e);
                    e.target.src = Avatar;
                }}
            />
            <ProfileDetails>
                <ProfileName title={user?.name}>
                    {user?.name ? user.name.split(" ")[0] : ""}
                </ProfileName>
            </ProfileDetails>
            <PermissionToggle permission={permission} onClick={togglePermission}>
                {permission === "read" ? "Grant Write" : "Set ReadOnly"}
            </PermissionToggle>
        </ProfileContainer>
    );
};

export default CollabProfile;
